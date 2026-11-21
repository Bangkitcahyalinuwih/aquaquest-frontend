<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getDashboard } from '@/api/dashboard'
import { useAsyncData } from '@/composables/useAsyncData'
import { useAuthStore } from '@/stores/auth'
import StateBlock from '@/components/ui/StateBlock.vue'

const auth = useAuthStore()
const router = useRouter()
const { data, loading, error, muat } = useAsyncData(getDashboard)

// Admin punya dashboard sendiri (seperti di v1).
if (auth.isAdmin) router.replace({ name: 'admin-dashboard' })
else muat()

const d = computed(() => data.value?.data)

// Progres menuju kartu berikutnya (0 sampai 100)
const persenKartu = computed(() => {
  if (!d.value?.kartu_berikutnya) return 100
  return Math.min(100, Math.floor((d.value.user.total_xp / d.value.kartu_berikutnya.xp_syarat) * 100))
})
// Progres di dalam level berjalan: tiap level butuh 100 XP
const persenLevel = computed(() => (d.value ? d.value.user.total_xp % 100 : 0))
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
    <StateBlock :loading="loading" :error="error" @retry="muat()">
      <div v-if="d" class="space-y-6">
        <h1 class="text-2xl font-bold text-primary">Halo, {{ d.user.name }} 👋</h1>

        <!-- Pengguna baru -->
        <div v-if="!d.pernah_main" class="rounded-lg bg-primary p-6 text-white">
          <h2 class="text-lg font-semibold">Selamat datang di AquaQuest!</h2>
          <p class="mt-1 text-cyan-50">Mainkan kuis pertamamu untuk mendapat XP dan membuka kartu koleksi pertama.</p>
          <RouterLink :to="{ name: 'kuis' }" class="mt-4 inline-block rounded-md bg-white px-5 py-2 font-semibold text-primary">Mulai Kuis</RouterLink>
        </div>

        <!-- Ringkasan -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="rounded-lg bg-white p-4 shadow"><p class="text-3xl font-bold text-primary">{{ d.user.level }}</p><p class="text-xs text-slate-500">Level</p></div>
          <div class="rounded-lg bg-white p-4 shadow"><p class="text-3xl font-bold text-primary">{{ d.user.total_xp }}</p><p class="text-xs text-slate-500">Total XP</p></div>
          <div class="rounded-lg bg-white p-4 shadow"><p class="text-3xl font-bold text-primary">{{ d.jumlah_kartu_dimiliki }}</p><p class="text-xs text-slate-500">Kartu Dimiliki</p></div>
        </div>

        <!-- Progres level -->
        <div class="rounded-lg bg-white p-5 shadow">
          <p class="text-sm">Menuju level {{ d.user.level + 1 }}: <strong>{{ persenLevel }} / 100 XP</strong></p>
          <div class="mt-2 h-3 w-full rounded-full bg-slate-200"><div class="h-3 rounded-full bg-secondary" :style="{ width: persenLevel + '%' }"></div></div>
        </div>

        <!-- Progres kartu berikutnya -->
        <div v-if="d.kartu_berikutnya" class="rounded-lg bg-white p-5 shadow">
          <p class="text-sm">
            Kartu berikutnya: <strong>{{ d.kartu_berikutnya.nama }}</strong> ({{ d.user.total_xp }} / {{ d.kartu_berikutnya.xp_syarat }} XP)
          </p>
          <div class="mt-2 h-3 w-full rounded-full bg-slate-200"><div class="h-3 rounded-full bg-accent" :style="{ width: persenKartu + '%' }"></div></div>
        </div>
        <div v-else class="rounded-lg bg-white p-5 font-semibold text-accent shadow">Kamu sudah membuka semua kartu yang tersedia!</div>

        <!-- Status jatah XP harian -->
        <div class="rounded-lg border p-4 text-sm" :class="d.sudah_main_hari_ini ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-green-200 bg-green-50 text-green-800'">
          <template v-if="d.sudah_main_hari_ini">
            Kamu sudah mendapat jatah XP hari ini. Sesi tambahan tetap bisa dimainkan sebagai latihan, dan XP bisa didapat lagi besok.
          </template>
          <template v-else>Jatah XP hari ini belum dipakai. Selesaikan satu kuis untuk mendapat XP.</template>
        </div>

        <div class="flex flex-wrap gap-3">
          <RouterLink :to="{ name: 'kuis' }" class="rounded-md bg-primary px-4 py-2 text-sm text-white">Main Kuis</RouterLink>
          <RouterLink :to="{ name: 'koleksi' }" class="rounded-md border border-primary px-4 py-2 text-sm text-primary">Lihat Koleksi</RouterLink>
          <RouterLink :to="{ name: 'leaderboard' }" class="rounded-md border px-4 py-2 text-sm text-slate-600">Lihat Peringkat</RouterLink>
        </div>
      </div>
    </StateBlock>
  </section>
</template>
