<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const auth = useAuthStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()

const menuBuka = ref(false)       // menu mobile
const dropdownBuka = ref(false)   // dropdown nama pengguna

// Daftar menu dihitung ulang otomatis (computed) setiap status login atau peran berubah.
const menu = computed(() => {
  if (auth.isAdmin) {
    return [
      { label: 'Dashboard Admin', to: { name: 'admin-dashboard' }, awalan: '/admin', persis: true },
      { label: 'Kelola Biota', to: { name: 'admin-biota' }, awalan: '/admin/biota' },
      { label: 'Kelola Edukasi', to: { name: 'admin-edukasi' }, awalan: '/admin/edukasi' },
      { label: 'Kelola Soal', to: { name: 'admin-soal' }, awalan: '/admin/soal' },
      { label: 'Kelola Kartu', to: { name: 'admin-kartu' }, awalan: '/admin/kartu' },
    ]
  }

  const daftar = [
    { label: 'Beranda', to: { name: 'home' }, awalan: '/', persis: true },
    { label: 'Ensiklopedia', to: { name: 'biota' }, awalan: '/biota' },
    { label: 'Materi Edukasi', to: { name: 'edukasi' }, awalan: '/edukasi' },
    { label: 'Kuis', to: { name: 'kuis' }, awalan: '/kuis' },
  ]

  if (auth.isLoggedIn) {
    daftar.push(
      { label: 'Koleksi', to: { name: 'koleksi' }, awalan: '/koleksi' },
      { label: 'Peringkat', to: { name: 'leaderboard' }, awalan: '/leaderboard' },
      { label: 'Dashboard', to: { name: 'dashboard' }, awalan: '/dashboard' },
    )
  }
  return daftar
})

function aktif(item) {
  return item.persis ? route.path === item.awalan : route.path.startsWith(item.awalan)
}

// Setiap pindah halaman, tutup menu mobile dan dropdown.
watch(
  () => route.fullPath,
  () => {
    menuBuka.value = false
    dropdownBuka.value = false
  },
)

async function keluar() {
  await auth.logout()
  toast.success('Kamu sudah keluar.')
  router.push({ name: 'home' })
}
</script>

<template>
  <nav class="border-b bg-white shadow-sm">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <RouterLink :to="auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'home' }" class="flex items-center gap-2 text-xl font-bold text-primary">
        <span aria-hidden="true">🌊</span> AquaQuest
      </RouterLink>

      <!-- Menu desktop -->
      <div class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="item in menu"
          :key="item.label"
          :to="item.to"
          class="rounded-md px-3 py-2 text-sm font-medium"
          :class="aktif(item) ? 'bg-secondary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <!-- Sisi kanan desktop -->
      <div class="hidden items-center gap-2 lg:flex">
        <template v-if="!auth.isLoggedIn">
          <RouterLink :to="{ name: 'login' }" class="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary">Masuk</RouterLink>
          <RouterLink :to="{ name: 'register' }" class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800">Daftar</RouterLink>
        </template>

        <div v-else class="relative">
          <button class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary" @click="dropdownBuka = !dropdownBuka">
            {{ auth.user.name }} <span aria-hidden="true">▾</span>
          </button>
          <!-- Lapisan transparan: klik di luar dropdown menutupnya -->
          <div v-if="dropdownBuka" class="fixed inset-0 z-40" @click="dropdownBuka = false"></div>
          <div v-if="dropdownBuka" class="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
            <RouterLink v-if="auth.isAdmin" :to="{ name: 'home' }" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Lihat Situs</RouterLink>
            <RouterLink v-else :to="{ name: 'profil' }" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profil</RouterLink>
            <button class="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" @click="keluar">Keluar</button>
          </div>
        </div>
      </div>

      <!-- Tombol hamburger (mobile) -->
      <button class="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Buka menu" @click="menuBuka = !menuBuka">
        {{ menuBuka ? '✕' : '☰' }}
      </button>
    </div>

    <!-- Menu mobile -->
    <div v-if="menuBuka" class="space-y-1 border-t px-4 py-3 lg:hidden">
      <RouterLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="block rounded-md px-3 py-2 text-base font-medium"
        :class="aktif(item) ? 'bg-secondary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'"
      >
        {{ item.label }}
      </RouterLink>
      <template v-if="!auth.isLoggedIn">
        <RouterLink :to="{ name: 'login' }" class="block px-3 py-2 text-base font-medium text-slate-700">Masuk</RouterLink>
        <RouterLink :to="{ name: 'register' }" class="block px-3 py-2 text-base font-semibold text-primary">Daftar</RouterLink>
      </template>
      <template v-else>
        <RouterLink v-if="auth.isAdmin" :to="{ name: 'home' }" class="block px-3 py-2 text-base font-medium text-slate-700">Lihat Situs</RouterLink>
        <RouterLink v-else :to="{ name: 'profil' }" class="block px-3 py-2 text-base font-medium text-slate-700">Profil</RouterLink>
        <button class="block w-full px-3 py-2 text-left text-base font-medium text-slate-700" @click="keluar">Keluar</button>
      </template>
    </div>
  </nav>
</template>