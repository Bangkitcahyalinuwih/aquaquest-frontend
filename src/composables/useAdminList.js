import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/utils/errors'

export function useAdminList(api) {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const { data, loading, error, muat } = useAsyncData(api.daftar)

  const dihapus = ref(null) // item yang sedang menunggu konfirmasi hapus
  const menghapus = ref(false)

  // Nomor halaman disimpan di URL (?page=2) agar tetap setelah refresh dan tombol back berfungsi.
  watch(
    () => route.query.page,
    (page) => muat({ page }),
    { immediate: true },
  )

  const items = computed(() => data.value?.data ?? [])
  const meta = computed(() => data.value?.meta ?? null)

  const keHalaman = (page) => router.push({ query: { ...route.query, page } })
  const muatUlang = () => muat({ page: route.query.page })

  async function konfirmasiHapus() {
    menghapus.value = true
    try {
      await api.hapus(dihapus.value.id)
      toast.success('Data berhasil dihapus.')
      dihapus.value = null

      // Bila yang dihapus adalah satu-satunya baris di halaman terakhir, mundur satu halaman.
      if (items.value.length === 1 && meta.value?.current_page > 1)
        keHalaman(meta.value.current_page - 1)
      else await muatUlang()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      menghapus.value = false
    }
  }

  return { items, meta, loading, error, muatUlang, keHalaman, dihapus, menghapus, konfirmasiHapus }
}
