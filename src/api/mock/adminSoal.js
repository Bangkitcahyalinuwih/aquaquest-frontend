import { buatMockCrud } from './crud'
import { crudBiota } from './adminBiota'

const OPSI = ['a', 'b', 'c', 'd']
const kosong = (v) => v === '' || v === null || v === undefined

// Data awal dalam bentuk ADMIN (memuat jawaban_benar, berbeda dari soal yang dikirim ke pemain saat kuis)
const dataAwal = [
  { id: 1, biota_id: 1, tipe: 'teks', pertanyaan: 'Apa nama ilmiah penyu hijau?', opsi_a: 'Chelonia mydas', opsi_b: 'Dermochelys coriacea', opsi_c: 'Eretmochelys imbricata', opsi_d: 'Caretta caretta', jawaban_benar: 'a', poin: 10 },
  { id: 2, biota_id: 1, tipe: 'teks', pertanyaan: 'Saat dewasa, penyu hijau terutama memakan apa?', opsi_a: 'Ubur-ubur', opsi_b: 'Lamun dan alga', opsi_c: 'Ikan karang', opsi_d: 'Kepiting', jawaban_benar: 'b', poin: 10 },
  { id: 3, biota_id: 2, tipe: 'teks', pertanyaan: 'Bagaimana hiu paus mendapatkan makanan?', opsi_a: 'Memburu mamalia laut', opsi_b: 'Menerkam ikan besar', opsi_c: 'Menyaring plankton dari air', opsi_d: 'Memakan bangkai', jawaban_benar: 'c', poin: 10 },
  { id: 4, biota_id: 4, tipe: 'teks', pertanyaan: 'Dugong menggantungkan hidupnya pada ekosistem apa?', opsi_a: 'Hutan bakau', opsi_b: 'Laut dalam', opsi_c: 'Gua bawah laut', opsi_d: 'Padang lamun', jawaban_benar: 'd', poin: 10 },
  { id: 5, biota_id: null, tipe: 'teks', pertanyaan: 'SDG 14 "Life Below Water" berkaitan dengan apa?', opsi_a: 'Pelestarian ekosistem lautan', opsi_b: 'Energi bersih', opsi_c: 'Pendidikan berkualitas', opsi_d: 'Pengelolaan hutan', jawaban_benar: 'a', poin: 10 },
].map((s) => ({ ...s, gambar_url: null, biota: null }))   // objek biota dilengkapi oleh bentuk() saat pertama dibaca di bawah

function validasi(data, lama) {
  const errors = {}
  if (!['teks', 'gambar'].includes(data.tipe)) errors.tipe = ['Tipe soal tidak valid.']
  if (!data.pertanyaan) errors.pertanyaan = ['Pertanyaan wajib diisi.']
  for (const o of OPSI) if (!data[`opsi_${o}`]) errors[`opsi_${o}`] = [`Opsi ${o.toUpperCase()} wajib diisi.`]
  if (!OPSI.includes(data.jawaban_benar)) errors.jawaban_benar = ['Jawaban benar harus a, b, c, atau d.']

  const poin = Number(data.poin)
  if (!Number.isInteger(poin) || poin < 1 || poin > 100) errors.poin = ['Poin harus bilangan bulat 1 sampai 100.']

  // Aturan server: soal bertipe gambar wajib punya gambar (file baru, atau gambar lama saat mengubah)
  if (data.tipe === 'gambar' && !(data.gambar instanceof File) && !lama?.gambar_url) errors.gambar = ['Gambar wajib untuk soal tebak gambar.']
  return errors
}

function bentuk(item) {
  const biotaId = kosong(item.biota_id) ? null : Number(item.biota_id)
  const biota = biotaId ? crudBiota.semua().find((b) => b.id === biotaId) : null
  return {
    ...item,
    poin: Number(item.poin),
    biota_id: biotaId,
    biota: biota ? { id: biota.id, slug: biota.slug, nama: biota.nama } : null,
  }
}

export const crudSoal = buatMockCrud({ kunci: 'soal', dataAwal: dataAwal.map(bentuk), validasi, bentuk })
export const { daftar, detail, tambah, ubah, hapus } = crudSoal
