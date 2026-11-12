<script setup>
import { computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getEdukasi } from '@/api/edukasi'
import { useAsyncData } from '@/composables/useAsyncData'
import StateBlock from '@/components/ui/StateBlock.vue'

const route = useRoute()
const { data, loading, error, muat } = useAsyncData(getEdukasi)

watch(() => route.params.slug, (slug) => muat(slug), { immediate: true })

const edukasi = computed(() => data.value?.data)
const tidakAda = computed(() => error.value?.response?.status === 404)
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <RouterLink :to="{ name: 'edukasi' }" class="text-sm text-secondary">&larr; Kembali ke daftar</RouterLink>

    <StateBlock :loading="loading" :error="tidakAda ? null : error" :empty="tidakAda" empty-text="Materi tidak ditemukan."
                @retry="muat(route.params.slug)">
      <article v-if="edukasi" class="mt-4">
        <h1 class="text-3xl font-bold text-primary">{{ edukasi.judul }}</h1>
        <img v-if="edukasi.gambar_url" :src="edukasi.gambar_url" :alt="edukasi.judul" class="mt-4 max-h-80 w-full rounded-lg object-cover shadow" />

        <!-- whitespace-pre-line menjaga jeda paragraf dari teks API. {{ }} meng-escape HTML, jadi aman dari XSS. -->
        <div class="mt-6 whitespace-pre-line leading-relaxed text-slate-700">{{ edukasi.isi }}</div>

        <RouterLink v-if="edukasi.biota" :to="{ name: 'biota-detail', params: { slug: edukasi.biota.slug } }" class="mt-6 inline-block text-primary hover:underline">
          Lihat biota terkait: {{ edukasi.biota.nama }}
        </RouterLink>
      </article>
    </StateBlock>
  </section>
</template>