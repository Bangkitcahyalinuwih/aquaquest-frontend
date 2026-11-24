<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { soalAdmin } from '@/api/adminSoal'
import { useAdminList } from '@/composables/useAdminList'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { items, meta, loading, error, muatUlang, keHalaman, dihapus, menghapus, konfirmasiHapus } = useAdminList(soalAdmin)

const pesanHapus = computed(() => (dihapus.value ? 'Hapus soal ini? Tindakan ini tidak dapat dibatalkan.' : ''))
const ringkas = (teks, n = 70) => (teks.length > n ? `${teks.slice(0, n - 3)}...` : teks)
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-primary">Kelola Soal Kuis</h1>
      <RouterLink :to="{ name: 'admin-soal-baru' }" class="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-cyan-800">+ Tambah Soal</RouterLink>
    </div>

    <StateBlock :loading="loading" :error="error" :empty="!loading && !error && items.length === 0" empty-text="Belum ada soal." @retry="muatUlang">
      <div class="mt-6 overflow-x-auto rounded-lg bg-white shadow">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3">Pertanyaan</th><th class="px-4 py-3">Tipe</th><th class="px-4 py-3">Biota</th>
              <th class="px-4 py-3">Jawaban</th><th class="px-4 py-3">Poin</th><th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in items" :key="s.id" class="border-t">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img v-if="s.gambar_url" :src="s.gambar_url" alt="" class="h-10 w-14 rounded object-cover" />
                  <span>{{ ringkas(s.pertanyaan) }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="rounded px-2 py-0.5 text-xs" :class="s.tipe === 'gambar' ? 'bg-accent/20 text-orange-700' : 'bg-secondary/20 text-primary'">{{ s.tipe }}</span>
              </td>
              <td class="px-4 py-3">{{ s.biota?.nama ?? '-' }}</td>
              <td class="px-4 py-3 font-semibold">{{ s.jawaban_benar.toUpperCase() }}</td>
              <td class="px-4 py-3">{{ s.poin }}</td>
              <td class="space-x-3 whitespace-nowrap px-4 py-3">
                <RouterLink :to="{ name: 'admin-soal-edit', params: { id: s.id } }" class="text-primary hover:underline">Ubah</RouterLink>
                <button class="text-red-600 hover:underline" @click="dihapus = s">Hapus</button>
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
