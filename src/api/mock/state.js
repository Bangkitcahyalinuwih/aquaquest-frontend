// Keadaan pemain tiruan yang dipakai bersama oleh mock auth, kuis, koleksi, dan dashboard.
// Disimpan di localStorage agar bertahan saat halaman di-refresh, seperti database sungguhan.

const KUNCI_USER = 'mock_user' // sama dengan yang ditulis mock auth (minggu 1)
const KUNCI_MAIN = 'mock_main' // { tanggal: 'YYYY-MM-DD', pernah: true }

export const levelDariXp = (xp) => Math.floor(xp / 100) + 1

export function bacaPengguna() {
  const tersimpan = localStorage.getItem(KUNCI_USER)
  return tersimpan ? JSON.parse(tersimpan) : null
}

export function simpanPengguna(user) {
  localStorage.setItem(KUNCI_USER, JSON.stringify(user))
}

// "Hari ini" menurut zona waktu Indonesia (sama dengan aturan server: Asia/Jakarta)
const hariIni = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }) // format YYYY-MM-DD

function bacaMain() {
  return JSON.parse(localStorage.getItem(KUNCI_MAIN) ?? '{}')
}

export const pernahMain = () => Boolean(bacaMain().pernah)
export const sudahMainHariIni = () => bacaMain().tanggal === hariIni()

export function catatSesiSelesai() {
  localStorage.setItem(KUNCI_MAIN, JSON.stringify({ tanggal: hariIni(), pernah: true }))
}

// Daftar kartu tiruan, urut menurut syarat XP (sama dengan seeder backend: 10 kartu, satu per biota).
const namaBiota = [
  'Penyu Hijau',
  'Hiu Paus',
  'Pari Manta Karang',
  'Dugong',
  'Paus Biru',
  'Kima Raksasa',
  'Ikan Badut',
  'Ikan Napoleon',
  'Penyu Belimbing',
  'Lumba-lumba Spinner',
]
const slugBiota = [
  'penyu-hijau',
  'hiu-paus',
  'pari-manta-karang',
  'dugong',
  'paus-biru',
  'kima-raksasa',
  'ikan-badut',
  'ikan-napoleon',
  'penyu-belimbing',
  'lumba-lumba-spinner',
]
const syarat = [50, 100, 150, 200, 300, 400, 500, 650, 800, 1000]

export const kartuMock = namaBiota.map((nama, i) => ({
  id: i + 1,
  nama: `Kartu ${nama}`,
  xp_syarat: syarat[i],
  gambar_url: null,
  biota: { slug: slugBiota[i], nama },
}))

// Kartu yang terbuka untuk total XP tertentu (di backend ini dicatat di tabel koleksi_kartu oleh KartuService)
export const kartuTerbukaUntuk = (xp) => kartuMock.filter((k) => k.xp_syarat <= xp)
