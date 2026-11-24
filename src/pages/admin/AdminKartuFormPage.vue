<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { biotaAdmin } from '@/api/adminBiota'
import { kartuAdmin } from '@/api/adminKartu'
import { useAdminForm } from '@/composables/useAdminForm'
import FormField from '@/components/ui/FormField.vue'
import ImageField from '@/components/ui/ImageField.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { mode, form, errors, memuat, menyimpan, galatMuat, detail, simpan, muatData } = useAdminForm({
  api: kartuAdmin,
  rutDaftar: 'admin-kartu',
  awal: { biota_id: '', nama: '', xp_syarat: '', gambar: null },
})

// Satu biota hanya boleh punya satu kartu, jadi pilihan hanya biota yang belum punya kartu.
const opsiBiota = ref([])
biotaAdmin.opsi({ tanpa_kartu: 1 }).then((body) => (opsiBiota.value = body.data)).catch(() => (opsiBiota.value = []))

// Saat mengubah, biota milik kartu itu sendiri harus tetap tersedia di pilihan (padahal ia "sudah punya kartu").
const daftarBiota = computed(() => {
  const daftar = [...opsiBiota.value]
  const sekarang = detail.value?.biota
  if (sekarang && !daftar.some((b) => b.id === sekarang.id)) daftar.unshift({ id: sekarang.id, nama: sekarang.nama })
  return daftar
})

const kelasInput = 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary'
</script>

<template>
  <section class="mx-auto max-w-xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">{{ mode === 'ubah' ? 'Ubah Kartu' : 'Tambah Kartu' }}</h1>

    <StateBlock :loading="memuat" :error="galatMuat" @retry="muatData">
      <form class="mt-6 space-y-4 rounded-lg bg-white p-6 shadow" @submit.prevent="simpan">
        <FormField id="biota_id" label="Biota" :error="errors.biota_id">
          <select id="biota_id" v-model="form.biota_id" :class="kelasInput">
            <option value="">Pilih biota</option>
            <option v-for="b in daftarBiota" :key="b.id" :value="b.id">{{ b.nama }}</option>
          </select>
          <p class="mt-1 text-xs text-slate-500">Hanya biota yang belum memiliki kartu yang ditampilkan.</p>
        </FormField>

        <FormField id="nama" label="Nama kartu" :error="errors.nama">
          <input id="nama" v-model="form.nama" type="text" :class="kelasInput" />
        </FormField>

        <FormField id="xp_syarat" label="Syarat XP untuk membuka" :error="errors.xp_syarat">
          <input id="xp_syarat" v-model="form.xp_syarat" type="number" min="0" :class="kelasInput" />
        </FormField>

        <ImageField v-model="form.gambar" :label="mode === 'ubah' ? 'Gambar kartu (kosongkan bila tidak diganti)' : 'Gambar kartu (wajib)'"
                    :url-lama="detail?.gambar_url" :error="errors.gambar" />

        <div class="flex items-center gap-3">
          <button type="submit" :disabled="menyimpan" class="rounded-md bg-primary px-5 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60">
            {{ menyimpan ? 'Menyimpan...' : mode === 'ubah' ? 'Simpan Perubahan' : 'Simpan' }}
          </button>
          <RouterLink :to="{ name: 'admin-kartu' }" class="text-sm text-slate-600 hover:underline">Batal</RouterLink>
        </div>
      </form>
    </StateBlock>
  </section>
</template>
