<script setup>
import { RouterLink } from 'vue-router'

defineProps({ biota: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="{ name: 'biota-detail', params: { slug: biota.slug } }" class="block overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md">
    <img v-if="biota.gambar_url" :src="biota.gambar_url" :alt="biota.nama" loading="lazy" class="h-44 w-full object-cover" />
    <div v-else class="flex h-44 w-full items-center justify-center bg-cyan-100 text-5xl" aria-hidden="true">🐟</div>
    <div class="p-4">
      <span class="rounded bg-secondary/20 px-2 py-0.5 text-xs text-primary">{{ biota.kategori }}</span>
      <h3 class="mt-2 font-semibold text-primary">{{ biota.nama }}</h3>
      <p class="text-xs italic text-slate-500">{{ biota.nama_latin }}</p>
      <p class="mt-2 text-sm text-slate-600">{{ biota.deskripsi_singkat }}</p>
    </div>
  </RouterLink>
</template>