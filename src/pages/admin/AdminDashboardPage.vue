<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getAdminDashboard } from '@/api/adminDashboard'
import { useAsyncData } from '@/composables/useAsyncData'
import StateBlock from '@/components/ui/StateBlock.vue'

const { data, loading, error, muat } = useAsyncData(getAdminDashboard)
muat()

const d = computed(() => data.value?.data)
const statistik = computed(() =>
  d.value
    ? [
        ['Biota', d.value.jumlah_biota],
        ['Edukasi', d.value.jumlah_edukasi],
        ['Soal', d.value.jumlah_soal],
        ['Kartu', d.value.jumlah_kartu],
        ['Pemain', d.value.jumlah_pemain],
        ['Sesi Selesai', d.value.sesi_selesai],
      ]
    : [],
)

// Waktu relatif sederhana (Intl.RelativeTimeFormat bawaan browser, bahasa Indonesia)
const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })
function waktuRelatif(iso) {
  const menit = Math.round((new Date(iso) - new Date()) / 60000)
  if (Math.abs(menit) < 60) return rtf.format(menit, 'minute')
  if (Math.abs(menit) < 60 * 24) return rtf.format(Math.round(menit / 60), 'hour')
  return rtf.format(Math.round(menit / 60 / 24), 'day')
}

const pintasan = [
  { label: '+ Biota', to: { name: 'admin-biota-baru' } },
  { label: '+ Edukasi', to: { name: 'admin-edukasi-baru' } },
  { label: '+ Soal', to: { name: 'admin-soal-baru' } },
  { label: '+ Kartu', to: { name: 'admin-kartu-baru' } },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">Dashboard Admin</h1>

    <StateBlock :loading="loading" :error="error" @retry="muat()">
      <div v-if="d" class="mt-6 space-y-6">
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div
            v-for="[label, angka] in statistik"
            :key="label"
            class="rounded-lg bg-white p-4 text-center shadow"
          >
            <p class="text-2xl font-bold text-primary">{{ angka }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ label }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="rounded-lg bg-white p-4 shadow">
            <h2 class="mb-3 font-semibold">Pemain Teratas</h2>
            <p v-if="!d.pemain_teratas.length" class="text-sm text-slate-500">Belum ada pemain.</p>
            <div
              v-for="(p, i) in d.pemain_teratas"
              :key="p.id"
              class="flex justify-between border-t py-2 text-sm"
            >
              <span>{{ i + 1 }}. {{ p.name }}</span>
              <span class="text-slate-600">Level {{ p.level }} - {{ p.total_xp }} XP</span>
            </div>
          </div>

          <div class="rounded-lg bg-white p-4 shadow">
            <h2 class="mb-3 font-semibold">Sesi Kuis Terbaru</h2>
            <p v-if="!d.sesi_terbaru.length" class="text-sm text-slate-500">Belum ada sesi kuis.</p>
            <div
              v-for="(s, i) in d.sesi_terbaru"
              :key="i"
              class="flex justify-between border-t py-2 text-sm"
            >
              <span>{{ s.pemain }}</span>
              <span class="text-slate-600"
                >{{ s.jumlah_benar }}/5 benar, {{ waktuRelatif(s.selesai_at) }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <RouterLink
            v-for="p in pintasan"
            :key="p.label"
            :to="p.to"
            class="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-cyan-800"
            >{{ p.label }}</RouterLink
          >
        </div>
      </div>
    </StateBlock>
  </section>
</template>
