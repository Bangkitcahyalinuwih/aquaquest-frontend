import { sleep } from '../config'
import { biotaKeRingkas, biotaPenuh, edukasiKeRingkas, edukasiPenuh } from './data'

export async function getBeranda() {
  await sleep(300)
  return {
    data: {
      statistik: { jumlah_biota: biotaPenuh.length, jumlah_soal: 24, jumlah_pemain: 9 },
      biota_pilihan: biotaPenuh.slice(0, 3).map(biotaKeRingkas),
      edukasi_terbaru: edukasiPenuh.slice(0, 3).map(edukasiKeRingkas),
    },
  }
}