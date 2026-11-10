import { sleep } from '../config'
import { galat, paginasi } from './helpers'
import { biotaKeRingkas, biotaPenuh } from './data'

export async function getBiotaList({ q, kategori, page } = {}) {
  await sleep(300)

  let hasil = [...biotaPenuh].sort((a, b) => a.nama.localeCompare(b.nama))
  if (q) {
    const kata = q.toLowerCase()
    hasil = hasil.filter((b) => b.nama.toLowerCase().includes(kata) || (b.nama_latin ?? '').toLowerCase().includes(kata))
  }
  if (kategori) hasil = hasil.filter((b) => b.kategori === kategori)

  return paginasi(hasil.map(biotaKeRingkas), page)
}

export async function getKategori() {
  await sleep(100)
  return { data: [...new Set(biotaPenuh.map((b) => b.kategori))].sort() }
}

export async function getBiota(slug) {
  await sleep(300)
  const biota = biotaPenuh.find((b) => b.slug === slug)
  if (!biota) throw galat(404, { message: 'Data tidak ditemukan.' })
  return { data: biota }
}