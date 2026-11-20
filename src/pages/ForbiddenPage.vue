<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-md px-4 py-20 text-center">
    <p class="text-6xl font-extrabold text-primary">403</p>
    <h1 class="mt-2 text-xl font-semibold">Akses ditolak</h1>
    <p class="mt-2 text-slate-600">Kamu tidak punya izin untuk membuka halaman ini.</p>
    <RouterLink :to="{ name: 'home' }" class="mt-6 inline-block rounded-md bg-primary px-5 py-2 font-semibold text-white">Kembali ke Beranda</RouterLink>
  </section>
</template>