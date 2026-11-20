import { sleep } from '../config'
import { galat } from './helpers'
import { bacaPengguna, simpanPengguna } from './state'

export async function updateProfil({ name, current_password: lama, password, password_confirmation: konfirmasi }) {
  await sleep(300)
  const user = bacaPengguna()
  if (!user) throw galat(401, { message: 'Unauthenticated.' })

  const errors = {}
  if (!name) errors.name = ['Nama wajib diisi.']
  if (password) {
    if (!lama) errors.current_password = ['Kata sandi saat ini wajib diisi.']
    else if (lama !== 'password') errors.current_password = ['Kata sandi saat ini salah.'] // mock: semua akun memakai "password"
    if (password.length < 8) errors.password = ['Kata sandi minimal 8 karakter.']
    else if (password !== konfirmasi) errors.password = ['Konfirmasi kata sandi tidak cocok.']
  }
  if (Object.keys(errors).length) throw galat(422, { message: 'Data tidak valid.', errors })

  user.name = name
  simpanPengguna(user)
  return { data: user }
}
