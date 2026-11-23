<script setup>
defineProps({
  buka: { type: Boolean, default: false },
  judul: { type: String, default: 'Konfirmasi' },
  pesan: { type: String, default: '' },
  labelYa: { type: String, default: 'Hapus' },
  loading: { type: Boolean, default: false },
})
defineEmits(['ya', 'batal'])
</script>

<template>
  <div
    v-if="buka"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    role="dialog"
    aria-modal="true"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
      <h2 class="text-lg font-semibold">{{ judul }}</h2>
      <p class="mt-2 text-sm text-slate-600">{{ pesan }}</p>
      <div class="mt-5 flex justify-end gap-3">
        <button
          class="rounded-md border px-4 py-2 text-sm"
          :disabled="loading"
          @click="$emit('batal')"
        >
          Batal
        </button>
        <button
          class="rounded-md bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60"
          :disabled="loading"
          @click="$emit('ya')"
        >
          {{ loading ? 'Memproses...' : labelYa }}
        </button>
      </div>
    </div>
  </div>
</template>
