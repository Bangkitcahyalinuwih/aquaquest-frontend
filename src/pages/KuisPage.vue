<script setup>
import { RouterLink } from 'vue-router'
import { useKuis } from '@/composables/useKuis'

const { status, soal, indeks, soalSekarang, progres, waktuTampil, sisaDetik, terkunci, pilihan, jawabanBenar, hasil, pesanError, mulai, jawab } = useKuis()

mulai() // langsung mulai sesi saat halaman dibuka

// Warna opsi: hijau untuk jawaban benar (dari server), merah untuk pilihan pemain yang salah.
function kelasOpsi(opsi) {
  if (pilihan.value === null) return 'border-slate-300 hover:border-primary'
  if (opsi === jawabanBenar.value) return 'border-green-500 bg-green-50'
  if (opsi === pilihan.value) return 'border-red-500 bg-red-50'
  return 'border-slate-200 opacity-60'
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-8">
    <!-- Memuat -->
    <p v-if="status === 'memuat'" class="py-16 text-center text-slate-600">Memuat soal...</p>

    <!-- Gagal (misalnya belum ada soal) -->
    <div v-else-if="status === 'gagal'" class="py-16 text-center">
      <p class="font-semibold text-red-600">{{ pesanError }}</p>
      <div class="mt-4 flex justify-center gap-3">
        <button class="rounded-md bg-primary px-4 py-2 text-sm text-white" @click="mulai">Coba lagi</button>
        <RouterLink :to="{ name: 'home' }" class="rounded-md border px-4 py-2 text-sm text-slate-600">Beranda</RouterLink>
      </div>
    </div>

    <!-- Sedang mengerjakan -->
    <div v-else-if="status === 'berjalan'">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-sm text-slate-600">Soal {{ indeks + 1 }} / {{ soal.length }}</span>
        <span class="font-mono text-lg font-bold" :class="sisaDetik <= 10 ? 'text-red-600' : 'text-primary'">{{ waktuTampil }}</span>
      </div>

      <div class="mb-6 h-2 w-full rounded-full bg-slate-200">
        <div class="h-2 rounded-full bg-secondary transition-all" :style="{ width: progres + '%' }"></div>
      </div>

      <!-- Soal tebak gambar -->
      <img v-if="soalSekarang.tipe === 'gambar' && soalSekarang.gambar_url" :src="soalSekarang.gambar_url" alt="Gambar soal"
           class="mx-auto mb-4 max-h-64 rounded-lg object-contain" />

      <h1 class="mb-4 text-lg font-semibold">{{ soalSekarang.pertanyaan }}</h1>

      <div class="grid grid-cols-1 gap-2">
        <button v-for="opsi in ['a', 'b', 'c', 'd']" :key="opsi" :disabled="terkunci"
                class="min-h-[44px] rounded-lg border bg-white p-3 text-left" :class="kelasOpsi(opsi)" @click="jawab(opsi)">
          {{ opsi.toUpperCase() }}. {{ soalSekarang['opsi_' + opsi] }}
        </button>
      </div>

      <p v-if="pesanError" class="mt-3 text-sm text-red-600">{{ pesanError }}</p>
    </div>

    <!-- Selesai -->
    <div v-else-if="status === 'selesai'" class="rounded-lg bg-white p-6 text-center shadow">
      <h1 class="text-xl font-bold text-primary">Kuis Selesai!</h1>
      <p class="mt-3">Jawaban benar: <strong>{{ hasil.jumlah_benar }}</strong> / {{ soal.length }}</p>
      <p>XP didapat: <strong>{{ hasil.xp_didapat }}</strong></p>
      <p v-if="hasil.sudah_main_hari_ini" class="mt-1 text-sm text-slate-500">
        XP tidak bertambah karena kamu sudah mendapat XP hari ini. Sesi ini hanya latihan.
      </p>
      <p>Level sekarang: <strong>{{ hasil.level }}</strong></p>
      <p v-if="hasil.kartu_baru.length" class="mt-2 font-semibold text-accent">
        Kartu baru terbuka: {{ hasil.kartu_baru.join(', ') }}
      </p>
      <div class="mt-5 flex flex-wrap justify-center gap-3">
        <button class="rounded-md bg-primary px-4 py-2 text-sm text-white" @click="mulai">Main lagi</button>
        <RouterLink :to="{ name: 'koleksi' }" class="rounded-md border border-primary px-4 py-2 text-sm text-primary">Lihat Koleksi</RouterLink>
        <RouterLink :to="{ name: 'dashboard' }" class="rounded-md border px-4 py-2 text-sm text-slate-600">Dashboard</RouterLink>
      </div>
    </div>

    <!-- Waktu habis -->
    <div v-else-if="status === 'habis_waktu'" class="rounded-lg bg-white p-6 text-center shadow">
      <h1 class="text-xl font-bold text-red-600">Waktu Habis!</h1>
      <p class="mt-2 text-slate-600">Sesi ini tidak dihitung. Coba lagi dan jawab lebih cepat.</p>
      <button class="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-white" @click="mulai">Coba lagi</button>
    </div>
  </section>
</template>
