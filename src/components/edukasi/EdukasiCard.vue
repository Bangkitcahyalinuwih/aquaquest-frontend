<script setup>
import { RouterLink } from 'vue-router'

defineProps({ edukasi: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="{ name: 'edukasi-detail', params: { slug: edukasi.slug } }" class="flex flex-col overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md">
    <img v-if="edukasi.gambar_url" :src="edukasi.gambar_url" :alt="edukasi.judul" loading="lazy" class="h-40 w-full object-cover" />
    <div class="p-5">
      <h3 class="font-semibold text-primary">{{ edukasi.judul }}</h3>
      <p class="mt-2 text-sm text-slate-600">{{ edukasi.ringkasan }}</p>
      <span class="mt-3 inline-block text-sm font-medium text-secondary">Baca selengkapnya</span>
    </div>
  </RouterLink>
</template>