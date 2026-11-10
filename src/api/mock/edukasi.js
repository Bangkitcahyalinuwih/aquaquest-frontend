import { sleep } from '../config'
import { galat, paginasi } from './helpers'
import { edukasiKeRingkas, edukasiPenuh } from './data'

export async function getEdukasiList({ q, page } = {}) {
  await sleep(300)

  let hasil = [...edukasiPenuh].sort((a, b) => b.created_at.localeCompare(a.created_at))
  if (q) {
    const kata = q.toLowerCase()
    hasil = hasil.filter((e) => e.judul.toLowerCase().includes(kata) || e.isi.toLowerCase().includes(kata))
  }
  return paginasi(hasil.map(edukasiKeRingkas), page)
}

export async function getEdukasi(slug) {
  await sleep(300)
  const edukasi = edukasiPenuh.find((e) => e.slug === slug)
  if (!edukasi) throw galat(404, { message: 'Data tidak ditemukan.' })
  return { data: edukasi }
}