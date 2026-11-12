<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEdukasiList } from '@/api/edukasi'
import { useAsyncData } from '@/composables/useAsyncData'
import EdukasiCard from '@/components/edukasi/EdukasiCard.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const route = useRoute()
const router = useRouter()
const q = ref(route.query.q ?? '')

const { data, loading, error, muat } = useAsyncData(getEdukasiList)

watch(
  () => route.query,
  (query) => {
    q.value = query.q ?? ''
    muat({ q: query.q, page: query.page })
  },
  { immediate: true },
)

const daftar = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta ?? null)

const cari = () => router.push({ query: { q: q.value || undefined } })
const keHalaman = (page) => router.push({ query: { ...route.query, page } })
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">Materi Edukasi</h1>

    <form class="mt-6 flex gap-3" @submit.prevent="cari">
      <input v-model="q" type="search" placeholder="Cari materi..."
             class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary" />
      <button type="submit" class="rounded-md bg-primary px-5 py-2 text-white hover:bg-cyan-800">Cari</button>
    </form>

    <StateBlock :loading="loading" :error="error" :empty="!loading && !error && daftar.length === 0"
                empty-text="Belum ada materi yang cocok." @retry="muat({ q: route.query.q, page: route.query.page })">
      <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <EdukasiCard v-for="item in daftar" :key="item.slug" :edukasi="item" />
      </div>
      <PaginationBar :meta="meta" @ubah="keHalaman" />
    </StateBlock>
  </section>
</template>