<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: [Error, Object], default: null },
  empty: { type: Boolean, default: false },
  emptyText: { type: String, default: 'Data tidak ditemukan.' },
})
defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="py-16 text-center text-slate-500">Memuat data...</div>
  <div v-else-if="error" class="py-16 text-center">
    <p class="text-red-600">Gagal memuat data.</p>
    <button class="mt-3 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-cyan-800" @click="$emit('retry')">Coba lagi</button>
  </div>
  <div v-else-if="empty" class="py-16 text-center text-slate-500">{{ emptyText }}</div>
  <slot v-else />
</template>