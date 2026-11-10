<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-md px-4 py-20 text-center">
    <p class="text-6xl font-extrabold text-primary">404</p>
    <h1 class="mt-2 text-xl font-semibold">Halaman tidak ditemukan</h1>
    <p class="mt-2 text-slate-600">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
    <RouterLink :to="{ name: 'home' }" class="mt-6 inline-block rounded-md bg-primary px-5 py-2 font-semibold text-white">Kembali ke Beranda</RouterLink>
  </section>
</template>