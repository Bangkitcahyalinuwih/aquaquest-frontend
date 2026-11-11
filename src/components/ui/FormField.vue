<script setup>
// Pembungkus satu kolom form: label, isi (slot), dan pesan galat di bawahnya.
defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  error: { type: Array, default: () => [] },
})
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <slot />
    <p v-for="pesan in error" :key="pesan" class="mt-1 text-sm text-red-600">{{ pesan }}</p>
  </div>
</template>