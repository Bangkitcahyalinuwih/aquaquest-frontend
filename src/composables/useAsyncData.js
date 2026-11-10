import { ref } from 'vue'

// Membungkus pemanggilan async menjadi tiga state reaktif: data, loading, error, plus fungsi muat().
export function useAsyncData(ambil) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  let urutan = 0   // penanda permintaan terbaru

  async function muat(...args) {
    const saya = ++urutan
    loading.value = true
    error.value = null
    try {
      const hasil = await ambil(...args)
      // Jika sementara itu ada permintaan yang lebih baru, abaikan hasil yang lama.
      if (saya === urutan) data.value = hasil
    } catch (e) {
      if (saya === urutan) error.value = e
    } finally {
      if (saya === urutan) loading.value = false
    }
  }

  return { data, error, loading, muat }
}