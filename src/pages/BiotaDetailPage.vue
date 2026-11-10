<script setup>
import { computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getBiota } from '@/api/biota'
import { useAsyncData } from '@/composables/useAsyncData'
import StateBlock from '@/components/ui/StateBlock.vue'

const route = useRoute()
const { data, loading, error, muat } = useAsyncData(getBiota)

// Slug ada di path (/biota/penyu-hijau). Jika pindah dari satu biota ke biota lain, ambil data lagi.
watch(() => route.params.slug, (slug) => muat(slug), { immediate: true })

const biota = computed(() => data.value?.data)
const tidakAda = computed(() => error.value?.response?.status === 404)

const labelStatus = { LC: 'Risiko rendah', NT: 'Hampir terancam', VU: 'Rentan', EN: 'Genting', CR: 'Kritis' }
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <RouterLink :to="{ name: 'biota' }" class="text-sm text-secondary">&larr; Kembali ke ensiklopedia</RouterLink>

    <StateBlock :loading="loading" :error="tidakAda ? null : error" :empty="tidakAda" empty-text="Biota tidak ditemukan."
                @retry="muat(route.params.slug)">
      <article v-if="biota" class="mt-4">
        <h1 class="text-3xl font-bold text-primary">{{ biota.nama }}</h1>
        <p v-if="biota.nama_latin" class="italic text-slate-500">{{ biota.nama_latin }}</p>

        <img v-if="biota.gambar_url" :src="biota.gambar_url" :alt="biota.nama" class="mt-4 max-h-96 w-full rounded-lg object-cover shadow" />

        <div class="mt-4 flex flex-wrap gap-2">
          <span class="rounded bg-secondary/20 px-2 py-1 text-xs text-primary">{{ biota.kategori }}</span>
          <span v-if="biota.status_konservasi" class="rounded bg-accent/20 px-2 py-1 text-xs text-orange-700">
            Status: {{ biota.status_konservasi }} ({{ labelStatus[biota.status_konservasi] ?? '-' }})
          </span>
        </div>

        <p class="mt-4 leading-relaxed text-slate-700">{{ biota.deskripsi }}</p>
        <p v-if="biota.habitat" class="mt-3 text-sm"><strong>Habitat:</strong> {{ biota.habitat }}</p>

        <!-- Peta Leaflet ditambahkan di minggu 2. Sementara tampilkan koordinatnya. -->
        <div v-if="biota.latitude !== null && biota.longitude !== null" class="mt-4 rounded border bg-white p-4 text-sm text-slate-600">
          Lokasi: {{ biota.latitude }}, {{ biota.longitude }} (peta akan ditambahkan)
        </div>
      </article>
    </StateBlock>
  </section>
</template>