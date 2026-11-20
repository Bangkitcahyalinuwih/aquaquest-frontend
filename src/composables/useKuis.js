import { computed, onBeforeUnmount, ref } from 'vue'
import * as kuisApi from '@/api/kuis'
import { useAuthStore } from '@/stores/auth'
import { errorMessage } from '@/utils/errors'

const JEDA_LANJUT_MS = 1200 // waktu menampilkan warna benar/salah sebelum pindah soal

export function useKuis() {
  const auth = useAuthStore()

  // status: memuat | berjalan | selesai | habis_waktu | gagal
  const status = ref('memuat')
  const gameId = ref(null)
  const deadline = ref(null)
  const soal = ref([])
  const indeks = ref(0)
  const sisaDetik = ref(0)
  const terkunci = ref(false) // true setelah memilih, sampai pindah ke soal berikutnya
  const pilihan = ref(null) // opsi yang dipilih pemain
  const jawabanBenar = ref(null) // kunci yang DIKIRIM SERVER setelah dijawab
  const hasil = ref(null)
  const pesanError = ref('')

  let timer = null
  let jeda = null

  const soalSekarang = computed(() => soal.value[indeks.value] ?? {})
  const progres = computed(() => (soal.value.length ? (indeks.value / soal.value.length) * 100 : 0))
  const waktuTampil = computed(() => {
    const menit = String(Math.floor(sisaDetik.value / 60)).padStart(2, '0')
    const detik = String(sisaDetik.value % 60).padStart(2, '0')
    return `${menit}:${detik}`
  })

  function bersihkan() {
    clearInterval(timer)
    clearTimeout(jeda)
  }
  // Wajib: bila pemain meninggalkan halaman, hentikan timer. Tanpa ini timer tetap berjalan di latar belakang.
  onBeforeUnmount(bersihkan)

  // Waktu sisa dihitung dari deadline yang diberikan server. Ini hanya TAMPILAN; keputusan menerima jawaban ada di server.
  function hitungSisa() {
    sisaDetik.value = Math.max(0, Math.floor((deadline.value - new Date()) / 1000))
    if (sisaDetik.value <= 0 && status.value === 'berjalan') {
      bersihkan()
      status.value = 'habis_waktu'
    }
  }

  async function mulai() {
    bersihkan()
    status.value = 'memuat'
    indeks.value = 0
    terkunci.value = false
    pilihan.value = null
    jawabanBenar.value = null
    hasil.value = null
    pesanError.value = ''

    try {
      const body = await kuisApi.mulai()
      gameId.value = body.data.game_id
      deadline.value = new Date(body.data.deadline_at)
      soal.value = body.data.soal
      status.value = 'berjalan'
      hitungSisa()
      timer = setInterval(hitungSisa, 1000)
    } catch (e) {
      pesanError.value = errorMessage(e) // contoh: "Belum ada soal kuis yang tersedia."
      status.value = 'gagal'
    }
  }

  async function jawab(opsi) {
    if (terkunci.value || status.value !== 'berjalan') return
    terkunci.value = true
    pesanError.value = ''
    pilihan.value = opsi

    try {
      const body = await kuisApi.jawab(gameId.value, { soal_id: soalSekarang.value.id, pilihan: opsi })
      jawabanBenar.value = body.data.jawaban_benar
      jeda = setTimeout(lanjut, JEDA_LANJUT_MS)
    } catch (e) {
      // Server menolak (misalnya waktu habis). Tampilkan hasilnya, jangan membuat halaman macet.
      if (/waktu/i.test(errorMessage(e))) {
        bersihkan()
        status.value = 'habis_waktu'
      } else {
        pesanError.value = errorMessage(e)
        terkunci.value = false
        pilihan.value = null
      }
    }
  }

  async function lanjut() {
    terkunci.value = false
    pilihan.value = null
    jawabanBenar.value = null

    if (indeks.value + 1 < soal.value.length) {
      indeks.value++
      return
    }
    await selesaikan()
  }

  async function selesaikan() {
    bersihkan()
    try {
      const body = await kuisApi.selesai(gameId.value)
      hasil.value = body.data
      status.value = 'selesai'
      await auth.refreshUser() // level dan XP berubah di server; perbarui navbar dan store
    } catch (e) {
      pesanError.value = errorMessage(e)
      status.value = 'gagal'
    }
  }

  return { status, soal, indeks, soalSekarang, progres, waktuTampil, sisaDetik, terkunci, pilihan, jawabanBenar, hasil, pesanError, mulai, jawab }
}
