import { buatMockCrud } from './crud'
import { crudBiota } from './adminBiota'
import { kartuMock } from './state'

const kosong = (v) => v === '' || v === null || v === undefined

// Data awal: 6 kartu pertama (kartuMock urut sama dengan biota id 1 sampai 10). Sisa biota belum punya kartu.
const dataAwal = kartuMock.slice(0, 6).map((k, i) => ({
  id: k.id, biota_id: i + 1, biota: { id: i + 1, slug: k.biota.slug, nama: k.biota.nama },
  nama: k.nama, xp_syarat: k.xp_syarat, gambar_url: null,
}))

function validasi(data, lama) {
  const errors = {}
  const biotaId = Number(data.biota_id)

  if (kosong(data.biota_id)) errors.biota_id = ['Biota wajib dipilih.']
  else if (!crudBiota.semua().some((b) => b.id === biotaId)) errors.biota_id = ['Biota yang dipilih tidak valid.']
  else if (crudKartu.semua().some((k) => k.biota_id === biotaId && k.id !== lama?.id)) errors.biota_id = ['Biota ini sudah memiliki kartu.']   // aturan server: satu biota satu kartu

  if (!data.nama) errors.nama = ['Nama kartu wajib diisi.']
  const xp = Number(data.xp_syarat)
  if (kosong(data.xp_syarat) || !Number.isInteger(xp) || xp < 0) errors.xp_syarat = ['Syarat XP harus bilangan bulat 0 atau lebih.']
  if (!lama && !(data.gambar instanceof File)) errors.gambar = ['Gambar kartu wajib diunggah.']   // wajib saat menambah
  return errors
}

function bentuk(item) {
  const biotaId = Number(item.biota_id)
  const biota = crudBiota.semua().find((b) => b.id === biotaId)
  return {
    ...item,
    biota_id: biotaId,
    xp_syarat: Number(item.xp_syarat),
    biota: biota ? { id: biota.id, slug: biota.slug, nama: biota.nama } : null,
  }
}

// API asli mengurutkan kartu menurut syarat XP; mock meniru urutan yang sama.
export const crudKartu = buatMockCrud({ kunci: 'kartu', dataAwal, validasi, bentuk, urut: (a, b) => a.xp_syarat - b.xp_syarat })
export const { daftar, detail, tambah, ubah, hapus } = crudKartu