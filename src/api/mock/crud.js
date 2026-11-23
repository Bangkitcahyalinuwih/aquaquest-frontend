import { sleep } from '../config'
import { galat, paginasi } from './helpers'

/**
 * dataAwal : data awal modul
 * validasi : (data, lama) => { kolom: ['pesan'] }   objek kosong bila valid
 * bentuk   : (item) => item   melengkapi/mengubah bentuk (mis. mengubah teks menjadi angka, membuat slug)
 * urut     : (a, b) => angka   urutan daftar (bawaan: id terbaru dahulu; kartu memakai syarat XP)
 */
export function buatMockCrud({
  kunci,
  dataAwal,
  validasi,
  bentuk = (item) => item,
  urut = (a, b) => b.id - a.id,
}) {
  const kunciSimpan = `mock_admin_${kunci}`

  const baca = () => {
    const tersimpan = localStorage.getItem(kunciSimpan)
    return tersimpan ? JSON.parse(tersimpan) : structuredClone(dataAwal)
  }
  const tulis = (daftar) => localStorage.setItem(kunciSimpan, JSON.stringify(daftar))

  function cari(daftar, id) {
    const item = daftar.find((x) => x.id === Number(id))
    if (!item) throw galat(404, { message: 'Data tidak ditemukan.' })
    return item
  }

  function periksa(data, lama) {
    const errors = validasi(data, lama)
    if (Object.keys(errors).length) throw galat(422, { message: 'Data tidak valid.', errors })
  }

  // File tidak bisa disimpan di localStorage; mock menyimpan alamat sementara (hidup selama tab terbuka).
  function gabung(lama, data) {
    const { gambar, ...sisa } = data
    const item = { ...lama, ...sisa }
    if (gambar instanceof File) item.gambar_url = URL.createObjectURL(gambar)
    return bentuk(item)
  }

  return {
    semua: () => baca(),

    async daftar({ page } = {}) {
      await sleep(300)
      return paginasi([...baca()].sort(urut), page, 10)
    },

    async detail(id) {
      await sleep(200)
      return { data: cari(baca(), id) }
    },

    async tambah(data) {
      await sleep(300)
      periksa(data, null)
      const daftar = baca()
      const item = gabung(
        { id: Math.max(0, ...daftar.map((x) => x.id)) + 1, gambar_url: null },
        data,
      )
      daftar.push(item)
      tulis(daftar)
      return { data: item }
    },

    async ubah(id, data) {
      await sleep(300)
      const daftar = baca()
      const lama = cari(daftar, id)
      periksa(data, lama)
      const baru = gabung(lama, data)
      tulis(daftar.map((x) => (x.id === lama.id ? baru : x)))
      return { data: baru }
    },

    async hapus(id) {
      await sleep(300)
      const daftar = baca()
      cari(daftar, id)
      tulis(daftar.filter((x) => x.id !== Number(id)))
    },
  }
}
