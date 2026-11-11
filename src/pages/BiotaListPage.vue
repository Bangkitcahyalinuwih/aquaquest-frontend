<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBiotaList, getKategori } from '@/api/biota'
import { useAsyncData } from '@/composables/useAsyncData'
import BiotaCard from '@/components/biota/BiotaCard.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const route = useRoute()
const router = useRouter()

// Kata kunci dan kategori disimpan di URL (?q=...&kategori=...&page=...) supaya hasil pencarian bisa di-refresh dan dibagikan.
const q = ref(route.query.q ?? '')
const kategori = ref(route.query.kategori ?? '')

// Destrukturisasi dengan nama berbeda karena ada dua pemanggilan API di halaman ini.
// Jangan menulis hasilnya sebagai objek (a.loading): di template, ref di dalam objek tidak otomatis di-unwrap.
const { data: biotaData, loading, error, muat } = useAsyncData(getBiotaList)
const { data: kategoriData, muat: muatKategori } = useAsyncData(getKategori)
muatKategori()

// Setiap query di URL berubah (cari, filter, ganti halaman, tombol back), ambil data lagi.
watch(
  () => route.query,
  (query) => {
    q.value = query.q ?? ''
    kategori.value = query.kategori ?? ''
    muat({ q: query.q, kategori: query.kategori, page: query.page })
  },
  { immediate: true },
)

const daftar = computed(() => biotaData.value?.data ?? [])
const meta = computed(() => biotaData.value?.meta ?? null)
const daftarKategori = computed(() => kategoriData.value?.data ?? [])
const adaFilter = computed(() => Boolean(route.query.q || route.query.kategori))

function cari() {
  // Mengubah query otomatis memicu watch di atas. Halaman kembali ke 1 karena "page" tidak ikut.
  router.push({ query: { q: q.value || undefined, kategori: kategori.value || undefined } })
}
function reset() {
  router.push({ query: {} })
}
function keHalaman(page) {
  router.push({ query: { ...route.query, page } })
}
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">Ensiklopedia Biota</h1>

    <form class="mt-6 flex flex-col gap-3 sm:flex-row" @submit.prevent="cari">
      <input v-model="q" type="search" placeholder="Cari nama biota..."
             class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary" />
      <select v-model="kategori" class="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary" @change="cari">
        <option value="">Semua kategori</option>
        <option v-for="k in daftarKategori" :key="k" :value="k">{{ k }}</option>
      </select>
      <button type="submit" class="rounded-md bg-primary px-5 py-2 text-white hover:bg-cyan-800">Cari</button>
      <button v-if="adaFilter" type="button" class="px-3 py-2 text-sm text-slate-600 hover:underline" @click="reset">Reset</button>
    </form>

    <StateBlock :loading="loading" :error="error" :empty="!loading && !error && daftar.length === 0"
                empty-text="Tidak ada biota yang cocok dengan pencarianmu." @retry="muat({ q: route.query.q, kategori: route.query.kategori, page: route.query.page })">
      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BiotaCard v-for="item in daftar" :key="item.slug" :biota="item" />
      </div>
      <PaginationBar :meta="meta" @ubah="keHalaman" />
    </StateBlock>
  </section>
</template>