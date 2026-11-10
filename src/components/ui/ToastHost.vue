<script setup>
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2" aria-live="polite">
    <div
      v-for="t in toast.items"
      :key="t.id"
      role="status"
      class="rounded-md border px-4 py-3 text-sm shadow-lg"
      :class="t.type === 'error' ? 'border-red-300 bg-red-50 text-red-800' : 'border-green-300 bg-green-50 text-green-800'"
    >
      {{ t.message }}
    </div>
  </div>
</template>