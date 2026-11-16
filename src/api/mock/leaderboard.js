import { sleep } from '../config'
import { bacaPengguna } from './state'

const pemain = [
  { id: 3, name: 'Budi Santoso', level: 5, total_xp: 420 },
  { id: 4, name: 'Siti Aminah', level: 4, total_xp: 360 },
  { id: 5, name: 'Rizky Pratama', level: 4, total_xp: 310 },
  { id: 6, name: 'Dewi Lestari', level: 3, total_xp: 250 },
  { id: 7, name: 'Andi Wijaya', level: 2, total_xp: 180 },
  { id: 8, name: 'Maya Putri', level: 2, total_xp: 120 },
  { id: 9, name: 'Fajar Nugroho', level: 1, total_xp: 60 },
  { id: 10, name: 'Intan Permata', level: 1, total_xp: 30 },
]

export async function getLeaderboard() {
  await sleep(300)

  // Pemain yang sedang login ikut masuk dengan XP terbarunya (hasil kuis di mock), seperti database sungguhan.
  const daftar = [...pemain]
  const saya = bacaPengguna()
  if (saya && saya.role === 'user') {
    daftar.push({ id: saya.id, name: saya.name, level: saya.level, total_xp: saya.total_xp })
  }

  const urut = daftar.sort((a, b) => b.total_xp - a.total_xp || a.id - b.id).slice(0, 20)
  return { data: urut.map((p, i) => ({ peringkat: i + 1, ...p })) }
}