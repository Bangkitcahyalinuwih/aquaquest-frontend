import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const items = ref([])
  let urutan = 1

  function hapus(id) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  function tampil(message, type = 'success', ms = 4000) {
    const id = urutan++
    items.value.push({ id, message, type })
    setTimeout(() => hapus(id), ms)
  }

  const success = (message) => tampil(message, 'success')
  const error = (message) => tampil(message, 'error')

  return { items, hapus, tampil, success, error }
})