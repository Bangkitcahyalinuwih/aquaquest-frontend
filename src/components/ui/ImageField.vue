<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const MAKS_BYTE = 2 * 1024 * 1024 // 2 MB, sama dengan batas di API
const JENIS = ['image/jpeg', 'image/png', 'image/webp']

const props = defineProps({
  modelValue: { default: null }, // File yang dipilih, atau null
  urlLama: { type: String, default: null }, // gambar yang sudah tersimpan (mode ubah)
  label: { type: String, default: 'Gambar' },
  id: { type: String, default: 'gambar' },
  error: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const urlBaru = ref(null)
const galatLokal = ref('')

// Pratinjau file yang baru dipilih. URL sementara harus dilepas agar tidak memenuhi memori.
watch(
  () => props.modelValue,
  (file) => {
    if (urlBaru.value) URL.revokeObjectURL(urlBaru.value)
    urlBaru.value = file ? URL.createObjectURL(file) : null
  },
)
onBeforeUnmount(() => {
  if (urlBaru.value) URL.revokeObjectURL(urlBaru.value)
})

function pilih(event) {
  galatLokal.value = ''
  const file = event.target.files?.[0] ?? null

  // Pemeriksaan di browser hanya untuk kenyamanan (pesan cepat). API tetap memeriksa ulang isi file.
  if (file && !JENIS.includes(file.type)) {
    galatLokal.value = 'Format gambar harus JPG, PNG, atau WebP.'
    event.target.value = ''
    return
  }
  if (file && file.size > MAKS_BYTE) {
    galatLokal.value = 'Ukuran gambar maksimal 2 MB.'
    event.target.value = ''
    return
  }
  emit('update:modelValue', file)
}
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <img
      v-if="urlBaru || urlLama"
      :src="urlBaru || urlLama"
      alt="Pratinjau gambar"
      class="mt-2 h-32 rounded-md border object-cover"
    />
    <input
      :id="id"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="mt-2 block w-full text-sm"
      @change="pilih"
    />
    <p class="mt-1 text-xs text-slate-500">JPG, PNG, atau WebP. Maksimal 2 MB.</p>
    <p v-if="galatLokal" class="mt-1 text-sm text-red-600">{{ galatLokal }}</p>
    <p v-for="pesan in error" :key="pesan" class="mt-1 text-sm text-red-600">{{ pesan }}</p>
  </div>
</template>
