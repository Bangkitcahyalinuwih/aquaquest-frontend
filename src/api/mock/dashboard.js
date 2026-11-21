import { sleep } from '../config'
import { galat } from './helpers'
import { bacaPengguna, kartuMock, kartuTerbukaUntuk, pernahMain, sudahMainHariIni } from './state'

export async function getDashboard() {
  await sleep(300)
  const user = bacaPengguna()
  if (!user) throw galat(401, { message: 'Unauthenticated.' })

  const berikutnya = kartuMock.find((k) => k.xp_syarat > user.total_xp)   // kartu terdekat yang belum terbuka

  return {
    data: {
      user,
      kartu_berikutnya: berikutnya ? { nama: berikutnya.nama, xp_syarat: berikutnya.xp_syarat } : null,
      jumlah_kartu_dimiliki: kartuTerbukaUntuk(user.total_xp).length,
      pernah_main: pernahMain(),
      sudah_main_hari_ini: sudahMainHariIni(),
    },
  }
}
