<script setup></script>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { biotaAdmin } from '@/api/adminBiota'
import { edukasiAdmin } from '@/api/adminEdukasi'
import { useAdminForm } from '@/composables/useAdminForm'
import FormField from '@/components/ui/FormField.vue'
import ImageField from '@/components/ui/ImageField.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { mode, form, errors, memuat, menyimpan, galatMuat, detail, simpan, muatData } = useAdminForm(
  {
    api: edukasiAdmin,
    rutDaftar: 'admin-edukasi',
    awal: { judul: '', isi: '', biota_id: '', gambar: null },
  },
)

// Pilihan biota untuk <select> (kosong = artikel umum)
const daftarBiota = ref([])
biotaAdmin
  .opsi()
  .then((body) => (daftarBiota.value = body.data))
  .catch(() => (daftarBiota.value = []))

const kelasInput =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary'
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">
      {{ mode === 'ubah' ? 'Ubah Artikel' : 'Tambah Artikel' }}
    </h1>

    <StateBlock :loading="memuat" :error="galatMuat" @retry="muatData">
      <form class="mt-6 space-y-4 rounded-lg bg-white p-6 shadow" @submit.prevent="simpan">
        <FormField id="judul" label="Judul" :error="errors.judul">
          <input id="judul" v-model="form.judul" type="text" :class="kelasInput" />
        </FormField>

        <FormField id="biota_id" label="Biota terkait (opsional)" :error="errors.biota_id">
          <select id="biota_id" v-model="form.biota_id" :class="kelasInput">
            <option value="">Artikel umum (tidak terkait biota)</option>
            <option v-for="b in daftarBiota" :key="b.id" :value="b.id">{{ b.nama }}</option>
          </select>
        </FormField>

        <FormField id="isi" label="Isi artikel" :error="errors.isi">
          <textarea id="isi" v-model="form.isi" rows="12" :class="kelasInput"></textarea>
        </FormField>

        <ImageField v-model="form.gambar" :url-lama="detail?.gambar_url" :error="errors.gambar" />

        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="menyimpan"
            class="rounded-md bg-primary px-5 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
          >
            {{ menyimpan ? 'Menyimpan...' : mode === 'ubah' ? 'Simpan Perubahan' : 'Simpan' }}
          </button>
          <RouterLink :to="{ name: 'admin-edukasi' }" class="text-sm text-slate-600 hover:underline"
            >Batal</RouterLink
          >
        </div>
      </form>
    </StateBlock>
  </section>
</template>
