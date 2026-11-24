<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { kartuAdmin } from '@/api/adminKartu'
import { useAdminList } from '@/composables/useAdminList'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { items, meta, loading, error, muatUlang, keHalaman, dihapus, menghapus, konfirmasiHapus } = useAdminList(kartuAdmin)

const pesanHapus = computed(() =>
  dihapus.value ? `Hapus kartu "${dihapus.value.nama}"? Kartu ini juga hilang dari koleksi pemain yang sudah memilikinya.` : '',
)
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-primary">Kelola Kartu</h1>
      <RouterLink :to="{ name: 'admin-kartu-baru' }" class="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-cyan-800">+ Tambah Kartu</RouterLink>
    </div>

    <StateBlock :loading="loading" :error="error" :empty="!loading && !error && items.length === 0" empty-text="Belum ada kartu." @retry="muatUlang">
      <div class="mt-6 overflow-x-auto rounded-lg bg-white shadow">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr><th class="px-4 py-3">Gambar</th><th class="px-4 py-3">Nama</th><th class="px-4 py-3">Biota</th><th class="px-4 py-3">Syarat XP</th><th class="px-4 py-3">Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="k in items" :key="k.id" class="border-t">
              <td class="px-4 py-3">
                <img v-if="k.gambar_url" :src="k.gambar_url" :alt="k.nama" class="h-12 w-16 rounded object-cover" />
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-4 py-3 font-medium">{{ k.nama }}</td>
              <td class="px-4 py-3">{{ k.biota?.nama ?? '-' }}</td>
              <td class="px-4 py-3">{{ k.xp_syarat }}</td>
              <td class="space-x-3 whitespace-nowrap px-4 py-3">
                <RouterLink :to="{ name: 'admin-kartu-edit', params: { id: k.id } }" class="text-primary hover:underline">Ubah</RouterLink>
                <button class="text-red-600 hover:underline" @click="dihapus = k">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginationBar :meta="meta" @ubah="keHalaman" />
    </StateBlock>

    <ConfirmDialog :buka="dihapus !== null" :pesan="pesanHapus" :loading="menghapus" @ya="konfirmasiHapus" @batal="dihapus = null" />
  </section>
</template>
