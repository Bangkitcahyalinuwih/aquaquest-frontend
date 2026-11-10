import { sleep } from '../config'
import { galat } from './helpers'

const pengguna = [
  { id: 1, name: 'Admin Dinas Kelautan', email: 'admin@aquaquest.test', role: 'admin', level: 1, total_xp: 0 },
  { id: 2, name: 'Demo Pengguna', email: 'demo@aquaquest.test', role: 'user', level: 1, total_xp: 80 },
]

function simpan(user) {
  localStorage.setItem('mock_user', JSON.stringify(user))
  return { data: { token: 'mock-token', user } }
}

export async function login({ email, password }) {
  await sleep(300)
  const user = pengguna.find((u) => u.email === email)
  if (!user || password !== 'password') {
    throw galat(422, { message: 'Email atau kata sandi salah.', errors: { email: ['Email atau kata sandi salah.'] } })
  }
  return simpan(user)
}

export async function register({ name, email, password, password_confirmation: konfirmasi }) {
  await sleep(300)
  const errors = {}
  if (!name) errors.name = ['Nama wajib diisi.']
  if (pengguna.some((u) => u.email === email)) errors.email = ['Email sudah terdaftar.']
  if (!password || password.length < 8) errors.password = ['Kata sandi minimal 8 karakter.']
  else if (password !== konfirmasi) errors.password = ['Konfirmasi kata sandi tidak cocok.']
  if (Object.keys(errors).length) throw galat(422, { message: 'Data tidak valid.', errors })

  return simpan({ id: 99, name, email, role: 'user', level: 1, total_xp: 0 })
}

export async function logout() {
  await sleep(100)
  localStorage.removeItem('mock_user')
}

export async function me() {
  await sleep(100)
  const tersimpan = localStorage.getItem('mock_user')
  if (!tersimpan) throw galat(401, { message: 'Unauthenticated.' })
  return { data: JSON.parse(tersimpan) }
}