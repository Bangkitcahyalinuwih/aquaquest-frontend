<script setup>
import { computed } from 'vue'
import { getLeaderboard } from '@/api/leaderboard'
import { useAsyncData } from '@/composables/useAsyncData'
import { useAuthStore } from '@/stores/auth'
import StateBlock from '@/components/ui/StateBlock.vue'

const auth = useAuthStore()
const { data, loading, error, muat } = useAsyncData(getLeaderboard)
muat()

const daftar = computed(() => data.value?.data ?? [])
const medali = { 1: '🥇', 2: '🥈', 3: '🥉' }
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">Peringkat Pemain</h1>
    <p class="mt-1 text-sm text-slate-600">20 pemain dengan XP tertinggi.</p>

    <StateBlock :loading="loading" :error="error" :empty="!loading && !error && daftar.length === 0"
                empty-text="Belum ada pemain di peringkat." @retry="muat()">
      <div class="mt-6 overflow-x-auto rounded-lg bg-white shadow">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Nama</th>
              <th class="px-4 py-3">Level</th>
              <th class="px-4 py-3 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody>
            <!-- Baris pemain yang sedang login disorot (auth.user bisa null untuk tamu) -->
            <tr v-for="p in daftar" :key="p.id" class="border-t" :class="auth.user?.id === p.id ? 'bg-secondary/20 font-semibold' : ''">
              <td class="px-4 py-3">{{ medali[p.peringkat] ?? p.peringkat }}</td>
              <td class="px-4 py-3">{{ p.name }}<span v-if="auth.user?.id === p.id" class="ml-2 text-xs text-primary">(kamu)</span></td>
              <td class="px-4 py-3">{{ p.level }}</td>
              <td class="px-4 py-3 text-right">{{ p.total_xp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </StateBlock>
  </section>
</template>