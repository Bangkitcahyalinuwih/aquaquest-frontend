import { sleep } from '../config'
import { galat } from './helpers'
import { bacaPengguna, kartuMock, kartuTerbukaUntuk } from './state'

export async function getKoleksi() {
  await sleep(300)
  const user = bacaPengguna()
  if (!user) throw galat(401, { message: 'Unauthenticated.' })

  const terbuka = new Set(kartuTerbukaUntuk(user.total_xp).map((k) => k.id))
  return { data: { total_xp: user.total_xp, kartu: kartuMock.map((k) => ({ ...k, terbuka: terbuka.has(k.id) })) } }
}
