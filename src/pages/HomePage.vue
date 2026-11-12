<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getBeranda } from '@/api/beranda'
import { useAsyncData } from '@/composables/useAsyncData'
import { useAuthStore } from '@/stores/auth'
import BiotaCard from '@/components/biota/BiotaCard.vue'
import EdukasiCard from '@/components/edukasi/EdukasiCard.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const auth = useAuthStore()
const { data, loading, error, muat } = useAsyncData(getBeranda)
muat()

const beranda = computed(() => data.value?.data)

const fitur = [
  { ikon: '🐠', judul: 'Ensiklopedia', isi: 'Kenali biota laut lengkap dengan habitatnya.', to: { name: 'biota' } },
  { ikon: '📚', judul: 'Materi Edukasi', isi: 'Baca artikel singkat tentang ekosistem laut.', to: { name: 'edukasi' } },
  { ikon: '🎯', judul: 'Kuis', isi: 'Jawab soal bertema laut, kumpulkan XP, naikkan level.', to: { name: 'kuis' } },
  { ikon: '🃏', judul: 'Koleksi Kartu', isi: 'Buka kartu biota setiap XP-mu mencapai syaratnya.', to: { name: 'koleksi' } },
]
</script>

<template>
  <div>
    <!-- Hero: gradien ditulis langsung agar tidak bergantung versi Tailwind -->
    <section class="text-white" style="background: linear-gradient(135deg, #0e7490, #22d3ee)">
      <div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p class="mb-4 text-5xl" aria-hidden="true">🌊</p>
        <h1 class="text-3xl font-bold sm:text-5xl">Jelajahi Kehidupan Bawah Laut Indonesia</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-cyan-50">
          Pelajari biota laut, mainkan kuis, kumpulkan kartu koleksi, dan jadi bagian dari upaya menjaga lautan (SDG 14).
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <template v-if="!auth.isLoggedIn">
            <RouterLink :to="{ name: 'register' }" class="rounded-md bg-white px-6 py-3 font-semibold text-primary hover:bg-cyan-50">Daftar Gratis</RouterLink>
            <RouterLink :to="{ name: 'biota' }" class="rounded-md border border-white px-6 py-3 font-semibold text-white hover:bg-white/10">Lihat Ensiklopedia</RouterLink>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'kuis' }" class="rounded-md bg-white px-6 py-3 font-semibold text-primary hover:bg-cyan-50">Mulai Kuis</RouterLink>
            <RouterLink :to="{ name: 'dashboard' }" class="rounded-md border border-white px-6 py-3 font-semibold text-white hover:bg-white/10">Dashboard Saya</RouterLink>
          </template>
        </div>
      </div>
    </section>

    <StateBlock :loading="loading" :error="error" @retry="muat()">
      <template v-if="beranda">
        <!-- Statistik -->
        <section class="mx-auto -mt-8 max-w-5xl px-4 sm:px-6">
          <div class="grid grid-cols-3 gap-3 rounded-lg bg-white p-4 text-center shadow-lg">
            <div><p class="text-2xl font-bold text-primary">{{ beranda.statistik.jumlah_biota }}</p><p class="text-xs text-slate-500">Biota</p></div>
            <div><p class="text-2xl font-bold text-primary">{{ beranda.statistik.jumlah_soal }}</p><p class="text-xs text-slate-500">Soal Kuis</p></div>
            <div><p class="text-2xl font-bold text-primary">{{ beranda.statistik.jumlah_pemain }}</p><p class="text-xs text-slate-500">Pemain</p></div>
          </div>
        </section>

        <!-- Fitur -->
        <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 class="text-center text-2xl font-bold text-primary">Yang Bisa Kamu Lakukan</h2>
          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RouterLink v-for="f in fitur" :key="f.judul" :to="f.to" class="rounded-lg bg-white p-5 shadow transition hover:shadow-md">
              <p class="text-3xl" aria-hidden="true">{{ f.ikon }}</p>
              <h3 class="mt-3 font-semibold text-primary">{{ f.judul }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ f.isi }}</p>
            </RouterLink>
          </div>
        </section>

        <!-- Biota pilihan -->
        <section v-if="beranda.biota_pilihan.length" class="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div class="mb-6 flex items-end justify-between">
            <h2 class="text-2xl font-bold text-primary">Kenalan dengan Biota Laut</h2>
            <RouterLink :to="{ name: 'biota' }" class="text-sm text-primary hover:underline">Lihat semua</RouterLink>
          </div>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BiotaCard v-for="b in beranda.biota_pilihan" :key="b.slug" :biota="b" />
          </div>
        </section>

        <!-- Edukasi terbaru -->
        <section v-if="beranda.edukasi_terbaru.length" class="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div class="mb-6 flex items-end justify-between">
            <h2 class="text-2xl font-bold text-primary">Materi Terbaru</h2>
            <RouterLink :to="{ name: 'edukasi' }" class="text-sm text-primary hover:underline">Lihat semua</RouterLink>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <EdukasiCard v-for="e in beranda.edukasi_terbaru" :key="e.slug" :edukasi="e" />
          </div>
        </section>

        <!-- Ajakan untuk tamu -->
        <section v-if="!auth.isLoggedIn" class="mx-auto max-w-5xl px-4 pb-4 sm:px-6">
          <div class="rounded-lg bg-primary p-8 text-center text-white">
            <h2 class="text-2xl font-bold">Siap jadi penjaga lautan?</h2>
            <p class="mt-2 text-cyan-50">Daftar sekarang dan mulai kumpulkan XP serta kartu koleksimu.</p>
            <RouterLink :to="{ name: 'register' }" class="mt-5 inline-block rounded-md bg-white px-6 py-3 font-semibold text-primary">Daftar Sekarang</RouterLink>
          </div>
        </section>
      </template>
    </StateBlock>
  </div>
</template>