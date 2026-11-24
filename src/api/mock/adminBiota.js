import { sleep } from '../config'
import { buatMockCrud } from './crud'
import { biotaPenuh } from './data'

const slugify = (teks) =>
  teks
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'

const kosong = (v) => v === '' || v === null || v === undefined
const koordinatSalah = (v, batas) =>
  !kosong(v) && (Number.isNaN(Number(v)) || Math.abs(Number(v)) > batas)

function validasi(data) {
  const errors = {}
  if (!data.nama) errors.nama = ['Nama wajib diisi.']
  if (!data.kategori) errors.kategori = ['Kategori wajib diisi.']
  if (!data.deskripsi) errors.deskripsi = ['Deskripsi wajib diisi.']
  if (koordinatSalah(data.latitude, 90))
    errors.latitude = ['Latitude harus berupa angka antara -90 dan 90.']
  if (koordinatSalah(data.longitude, 180))
    errors.longitude = ['Longitude harus berupa angka antara -180 dan 180.']
  return errors
}

// Melengkapi data: slug dibuat sekali (tidak berubah saat ubah), koordinat menjadi angka atau null.
function bentuk(item) {
  return {
    ...item,
    slug: item.slug ?? slugify(item.nama),
    latitude: kosong(item.latitude) ? null : Number(item.latitude),
    longitude: kosong(item.longitude) ? null : Number(item.longitude),
  }
}

export const crudBiota = buatMockCrud({ kunci: 'biota', dataAwal: biotaPenuh, validasi, bentuk })

// Pilihan biota untuk <select> pada form lain. Mock mengembalikan semua biota (API asli bisa menyaring ?tanpa_kartu=1).
export async function opsi() {
  await sleep(150)
  return {
    data: [...crudBiota.semua()]
      .sort((a, b) => a.nama.localeCompare(b.nama))
      .map((b) => ({ id: b.id, nama: b.nama })),
  }
}

export const { daftar, detail, tambah, ubah, hapus } = crudBiota
