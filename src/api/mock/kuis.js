import { sleep } from '../config'
import { galat } from './helpers'
import { bacaPengguna, catatSesiSelesai, kartuMock, levelDariXp, simpanPengguna, sudahMainHariIni } from './state'

// Bank soal tiruan. Kunci jawaban ada DI SINI (meniru server) dan tidak pernah dikirim ke halaman.
const bank = [
  { id: 1, pertanyaan: 'Apa nama ilmiah penyu hijau?', opsi: ['Chelonia mydas', 'Dermochelys coriacea', 'Eretmochelys imbricata', 'Caretta caretta'], benar: 'a', poin: 10 },
  { id: 2, pertanyaan: 'Saat dewasa, penyu hijau terutama memakan apa?', opsi: ['Ubur-ubur', 'Lamun dan alga', 'Ikan karang', 'Kepiting'], benar: 'b', poin: 10 },
  { id: 3, pertanyaan: 'Bagaimana hiu paus mendapatkan makanan?', opsi: ['Memburu mamalia laut', 'Menerkam ikan besar', 'Menyaring plankton dari air', 'Memakan bangkai'], benar: 'c', poin: 10 },
  { id: 4, pertanyaan: 'Dugong menggantungkan hidupnya pada ekosistem apa?', opsi: ['Hutan bakau', 'Laut dalam', 'Gua bawah laut', 'Padang lamun'], benar: 'd', poin: 10 },
  { id: 5, pertanyaan: 'Ikan badut hidup berdampingan dengan hewan apa?', opsi: ['Anemon laut', 'Hiu paus', 'Kima raksasa', 'Penyu hijau'], benar: 'a', poin: 10 },
  { id: 6, pertanyaan: 'Lumba-lumba menemukan mangsa dengan bantuan apa?', opsi: ['Penciuman tajam', 'Ekolokasi', 'Sengatan listrik', 'Cahaya tubuh'], benar: 'b', poin: 10 },
  { id: 7, pertanyaan: 'SDG 14 "Life Below Water" berkaitan dengan apa?', opsi: ['Energi bersih', 'Pendidikan berkualitas', 'Pelestarian ekosistem lautan', 'Pengelolaan hutan'], benar: 'c', poin: 10 },
  { id: 8, pertanyaan: 'Apa makanan utama paus biru?', opsi: ['Cumi raksasa', 'Ikan tuna', 'Penyu', 'Krill'], benar: 'd', poin: 10 },
]

let sesi = null // satu sesi aktif sudah cukup untuk mock

// Bentuk soal yang dikirim ke halaman: TANPA kunci jawaban (sesuai kontrak).
const bentukPublik = (s) => ({
  id: s.id,
  tipe: 'teks',
  pertanyaan: s.pertanyaan,
  gambar_url: null,
  opsi_a: s.opsi[0],
  opsi_b: s.opsi[1],
  opsi_c: s.opsi[2],
  opsi_d: s.opsi[3],
})

function pastikanSesi(gameId) {
  if (!sesi || sesi.id !== Number(gameId)) throw galat(403, { message: 'Sesi ini bukan milikmu.' })
}

export async function mulai() {
  await sleep(300)
  if (!bacaPengguna()) throw galat(401, { message: 'Unauthenticated.' })

  const terpilih = [...bank].sort(() => Math.random() - 0.5).slice(0, 5)
  sesi = { id: Math.floor(Math.random() * 90000) + 1000, soalIds: terpilih.map((s) => s.id), jawaban: {}, deadline: Date.now() + 5 * 60 * 1000, status: 'berjalan' }

  return { data: { game_id: sesi.id, deadline_at: new Date(sesi.deadline).toISOString(), soal: terpilih.map(bentukPublik) } }
}

export async function jawab(gameId, { soal_id: soalId, pilihan }) {
  await sleep(200)
  pastikanSesi(gameId)
  if (sesi.status !== 'berjalan') throw galat(422, { message: 'Sesi kuis sudah berakhir.' })
  if (Date.now() > sesi.deadline) {
    sesi.status = 'kedaluwarsa'
    throw galat(422, { message: 'Waktu kuis sudah habis.' })
  }
  if (!sesi.soalIds.includes(soalId)) throw galat(403, { message: 'Soal ini bukan bagian dari sesimu.' })
  if (sesi.jawaban[soalId]) throw galat(422, { message: 'Soal ini sudah pernah dijawab.' })
  if (!['a', 'b', 'c', 'd'].includes(pilihan)) throw galat(422, { message: 'Data tidak valid.', errors: { pilihan: ['Pilihan tidak valid.'] } })

  const soal = bank.find((s) => s.id === soalId)
  sesi.jawaban[soalId] = pilihan
  return { data: { benar: soal.benar === pilihan, jawaban_benar: soal.benar } }
}

export async function selesai(gameId) {
  await sleep(300)
  pastikanSesi(gameId)
  if (sesi.status !== 'berjalan') throw galat(422, { message: 'Sesi kuis sudah berakhir sebelumnya.' })

  let jumlahBenar = 0
  let poin = 0
  for (const [id, pilihan] of Object.entries(sesi.jawaban)) {
    const soal = bank.find((s) => s.id === Number(id))
    if (soal && soal.benar === pilihan) {
      jumlahBenar++
      poin += soal.poin
    }
  }

  const user = bacaPengguna()
  const sudahHariIni = sudahMainHariIni() // aturan anti-farming: hanya sesi pertama hari ini yang memberi XP
  const xp = sudahHariIni ? 0 : poin

  sesi.status = 'selesai'
  catatSesiSelesai()

  let kartuBaru = []
  if (xp > 0) {
    const sebelum = user.total_xp
    user.total_xp += xp
    user.level = levelDariXp(user.total_xp)
    kartuBaru = kartuMock.filter((k) => k.xp_syarat > sebelum && k.xp_syarat <= user.total_xp).map((k) => k.nama)
    simpanPengguna(user)
  }

  return { data: { jumlah_benar: jumlahBenar, xp_didapat: xp, sudah_main_hari_ini: sudahHariIni, level: user.level, kartu_baru: kartuBaru } }
}
