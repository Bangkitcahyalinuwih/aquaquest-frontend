import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { errorMessage, validationErrors } from '@/utils/errors'

// awal: nilai awal semua kolom, termasuk gambar: null. rutDaftar: nama route halaman daftar.
export function useAdminForm({ api, awal, rutDaftar }) {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const id = computed(() => route.params.id) // ada = mode ubah, tidak ada = mode tambah
  const mode = computed(() => (id.value ? 'ubah' : 'tambah'))

  const form = reactive({ ...awal })
  const errors = ref({})
  const memuat = ref(false)
  const menyimpan = ref(false)
  const galatMuat = ref(null)
  const detail = ref(null) // data lengkap dari server (mis. untuk pratinjau gambar lama)

  async function muatData() {
    if (!id.value) return
    memuat.value = true
    galatMuat.value = null
    try {
      const body = await api.detail(id.value)
      detail.value = body.data
      for (const kunci of Object.keys(awal)) {
        if (kunci !== 'gambar') form[kunci] = body.data[kunci] ?? awal[kunci]
      }
    } catch (e) {
      galatMuat.value = e
    } finally {
      memuat.value = false
    }
  }

  async function simpan() {
    menyimpan.value = true
    errors.value = {}
    try {
      if (mode.value === 'ubah') await api.ubah(id.value, { ...form })
      else await api.tambah({ ...form })

      toast.success(
        mode.value === 'ubah' ? 'Perubahan berhasil disimpan.' : 'Data berhasil ditambahkan.',
      )
      router.push({ name: rutDaftar })
    } catch (e) {
      errors.value = validationErrors(e) // 422: galat tampil di bawah kolom masing-masing
      if (!Object.keys(errors.value).length) toast.error(errorMessage(e))
    } finally {
      menyimpan.value = false
    }
  }

  muatData()

  return { mode, form, errors, memuat, menyimpan, galatMuat, detail, simpan, muatData }
}
