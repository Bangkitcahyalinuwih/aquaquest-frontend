<script setup>
import { computed } from 'vue'
import { getKoleksi } from '@/api/koleksi'
import { useAsyncData } from '@/composables/useAsyncData'
import StateBlock from '@/components/ui/StateBlock.vue'

const { data, loading, error, muat } = useAsyncData(getKoleksi)
muat()

const kartu = computed(() => data.value?.data.kartu ?? [])
const totalXp = computed(() => data.value?.data.total_xp ?? 0)
const jumlahTerbuka = computed(() => kartu.value.filter((k) => k.terbuka).length)
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">Koleksi Kartu</h1>

    <StateBlock :loading="loading" :error="error" :empty="!loading && !error && kartu.length === 0"
                empty-text="Belum ada kartu tersedia." @retry="muat()">
      <p class="mt-2 text-slate-600">
        Kamu memiliki <strong>{{ jumlahTerbuka }}</strong> dari <strong>{{ kartu.length }}</strong> kartu. Total XP: <strong>{{ totalXp }}</strong>
      </p>

      <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div v-for="k in kartu" :key="k.id" class="overflow-hidden rounded-lg bg-white text-center shadow" :class="k.terbuka ? '' : 'opacity-60'">
          <div class="flex h-36 items-center justify-center bg-cyan-100">
            <img v-if="k.terbuka && k.gambar_url" :src="k.gambar_url" :alt="k.nama" class="h-full w-full object-cover" />
            <span v-else class="text-5xl" aria-hidden="true">{{ k.terbuka ? '🐢' : '🔒' }}</span>
          </div>
          <div class="p-3">
            <h2 class="text-sm font-semibold" :class="k.terbuka ? 'text-primary' : 'text-slate-400'">
              {{ k.terbuka ? k.nama : 'Kartu Terkunci' }}
            </h2>
            <!-- Kartu terkunci menyembunyikan nama; yang tampil hanya kebutuhan XP-nya -->
            <p class="mt-1 text-xs text-slate-500">
              <template v-if="k.terbuka">{{ k.biota?.nama }}</template>
              <template v-else>Butuh {{ k.xp_syarat }} XP (kurang {{ Math.max(0, k.xp_syarat - totalXp) }})</template>
            </p>
          </div>
        </div>
      </div>
    </StateBlock>
  </section>
</template>

