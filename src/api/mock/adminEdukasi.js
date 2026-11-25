import { buatMockCrud } from './crud'
import { crudBiota } from './adminBiota'
import { biotaPenuh, edukasiPenuh } from './data'

const slugify = (teks) =>
  teks
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'

// Bentuk admin: id, slug, judul, isi, biota_id, biota {id, slug, nama} atau null, gambar_url, created_at
const dataAwal = edukasiPenuh.map((e) => {
  const biota = e.biota ? biotaPenuh.find((b) => b.slug === e.biota.slug) : null
  return {
    ...e,
    biota_id: biota?.id ?? null,
    biota: biota ? { id: biota.id, slug: biota.slug, nama: biota.nama } : null,
  }
})

function validasi(data) {
  const errors = {}
  if (!data.judul) errors.judul = ['Judul wajib diisi.']
  if (!data.isi) errors.isi = ['Isi artikel wajib diisi.']
  if (data.biota_id && !crudBiota.semua().some((b) => b.id === Number(data.biota_id)))
    errors.biota_id = ['Biota yang dipilih tidak valid.']
  return errors
}

function bentuk(item) {
  const biotaId = item.biota_id === '' || item.biota_id == null ? null : Number(item.biota_id)
  const biota = biotaId ? crudBiota.semua().find((b) => b.id === biotaId) : null
  return {
    ...item,
    slug: item.slug ?? slugify(item.judul),
    created_at: item.created_at ?? new Date().toISOString(),
    biota_id: biotaId,
    biota: biota ? { id: biota.id, slug: biota.slug, nama: biota.nama } : null,
  }
}

export const crudEdukasi = buatMockCrud({ kunci: 'edukasi', dataAwal, validasi, bentuk })
export const { daftar, detail, tambah, ubah, hapus } = crudEdukasi
