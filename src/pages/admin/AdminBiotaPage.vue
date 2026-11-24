<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { biotaAdmin } from '@/api/adminBiota'
import { useAdminList } from '@/composables/useAdminList'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { items, meta, loading, error, muatUlang, keHalaman, dihapus, menghapus, konfirmasiHapus } =
  useAdminList(biotaAdmin)

const pesanHapus = computed(() =>
  dihapus.value
    ? `Hapus biota "${dihapus.value.nama}"? Kartu terkait ikut terhapus dan tindakan ini tidak dapat dibatalkan.`
    : '',
)
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-primary">Kelola Biota</h1>
      <RouterLink
        :to="{ name: 'admin-biota-baru' }"
        class="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-cyan-800"
        >+ Tambah Biota</RouterLink
      >
    </div>

    <StateBlock
      :loading="loading"
      :error="error"
      :empty="!loading && !error && items.length === 0"
      empty-text="Belum ada data biota."
      @retry="muatUlang"
    >
      <div class="mt-6 overflow-x-auto rounded-lg bg-white shadow">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3">Gambar</th>
              <th class="px-4 py-3">Nama</th>
              <th class="px-4 py-3">Kategori</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in items" :key="b.id" class="border-t">
              <td class="px-4 py-3">
                <img
                  v-if="b.gambar_url"
                  :src="b.gambar_url"
                  :alt="b.nama"
                  class="h-12 w-16 rounded object-cover"
                />
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium">{{ b.nama }}</p>
                <p class="text-xs italic text-slate-500">{{ b.nama_latin }}</p>
              </td>
              <td class="px-4 py-3">{{ b.kategori }}</td>
              <td class="px-4 py-3">{{ b.status_konservasi ?? '-' }}</td>
              <td class="space-x-3 whitespace-nowrap px-4 py-3">
                <RouterLink
                  :to="{ name: 'admin-biota-edit', params: { id: b.id } }"
                  class="text-primary hover:underline"
                  >Ubah</RouterLink
                >
                <button class="text-red-600 hover:underline" @click="dihapus = b">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginationBar :meta="meta" @ubah="keHalaman" />
    </StateBlock>

    <ConfirmDialog
      :buka="dihapus !== null"
      :pesan="pesanHapus"
      :loading="menghapus"
      @ya="konfirmasiHapus"
      @batal="dihapus = null"
    />
  </section>
</template>
