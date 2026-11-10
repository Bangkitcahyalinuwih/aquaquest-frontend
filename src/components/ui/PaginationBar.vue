<script setup>
defineProps({ meta: { type: Object, default: null } })
defineEmits(['ubah'])
</script>

<template>
  <nav v-if="meta && meta.last_page > 1" class="mt-8 flex items-center justify-center gap-3" aria-label="Paginasi">
    <button class="rounded-md border bg-white px-4 py-2 text-sm disabled:opacity-40" :disabled="meta.current_page <= 1" @click="$emit('ubah', meta.current_page - 1)">
      Sebelumnya
    </button>
    <span class="text-sm text-slate-600">Halaman {{ meta.current_page }} dari {{ meta.last_page }}</span>
    <button class="rounded-md border bg-white px-4 py-2 text-sm disabled:opacity-40" :disabled="meta.current_page >= meta.last_page" @click="$emit('ubah', meta.current_page + 1)">
      Berikutnya
    </button>
  </nav>
</template>