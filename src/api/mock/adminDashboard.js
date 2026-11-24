import { sleep } from '../config'

export async function getAdminDashboard() {
  await sleep(300)
  return {
    data: {
      jumlah_biota: 10,
      jumlah_edukasi: 6,
      jumlah_soal: 24,
      jumlah_kartu: 10,
      jumlah_pemain: 9,
      sesi_selesai: 3,
      pemain_teratas: [
        { id: 3, name: 'Budi Santoso', level: 5, total_xp: 420 },
        { id: 4, name: 'Siti Aminah', level: 4, total_xp: 360 },
        { id: 5, name: 'Rizky Pratama', level: 4, total_xp: 310 },
      ],
      sesi_terbaru: [
        {
          pemain: 'Demo Pengguna',
          jumlah_benar: 4,
          selesai_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        },
        {
          pemain: 'Budi Santoso',
          jumlah_benar: 5,
          selesai_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    },
  }
}
