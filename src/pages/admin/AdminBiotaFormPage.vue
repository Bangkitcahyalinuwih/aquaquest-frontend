<script setup>
import { RouterLink } from 'vue-router'
import { biotaAdmin } from '@/api/adminBiota'
import { useAdminForm } from '@/composables/useAdminForm'
import FormField from '@/components/ui/FormField.vue'
import ImageField from '@/components/ui/ImageField.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { mode, form, errors, memuat, menyimpan, galatMuat, detail, simpan, muatData } = useAdminForm(
  {
    api: biotaAdmin,
    rutDaftar: 'admin-biota',
    awal: {
      nama: '',
      nama_latin: '',
      kategori: '',
      status_konservasi: '',
      habitat: '',
      deskripsi: '',
      latitude: '',
      longitude: '',
      gambar: null,
    },
  },
)

const kategoriUsulan = [
  'Ikan',
  'Mamalia Laut',
  'Reptil Laut',
  'Moluska',
  'Terumbu Karang',
  'Krustasea',
]
const kelasInput =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary'
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">
      {{ mode === 'ubah' ? 'Ubah Biota' : 'Tambah Biota' }}
    </h1>

    <StateBlock :loading="memuat" :error="galatMuat" @retry="muatData">
      <form
        class="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow sm:grid-cols-2"
        @submit.prevent="simpan"
      >
        <FormField id="nama" label="Nama" :error="errors.nama">
          <input id="nama" v-model="form.nama" type="text" :class="kelasInput" />
        </FormField>
        <FormField id="nama_latin" label="Nama latin" :error="errors.nama_latin">
          <input id="nama_latin" v-model="form.nama_latin" type="text" :class="kelasInput" />
        </FormField>
        <FormField id="kategori" label="Kategori" :error="errors.kategori">
          <input
            id="kategori"
            v-model="form.kategori"
            list="usulan-kategori"
            type="text"
            :class="kelasInput"
          />
          <datalist id="usulan-kategori">
            <option v-for="k in kategoriUsulan" :key="k" :value="k" />
          </datalist>
        </FormField>
        <FormField
          id="status_konservasi"
          label="Status konservasi (LC, NT, VU, EN, CR)"
          :error="errors.status_konservasi"
        >
          <input
            id="status_konservasi"
            v-model="form.status_konservasi"
            type="text"
            :class="kelasInput"
          />
        </FormField>
        <div class="sm:col-span-2">
          <FormField id="habitat" label="Habitat" :error="errors.habitat">
            <input id="habitat" v-model="form.habitat" type="text" :class="kelasInput" />
          </FormField>
        </div>
        <div class="sm:col-span-2">
          <FormField id="deskripsi" label="Deskripsi" :error="errors.deskripsi">
            <textarea
              id="deskripsi"
              v-model="form.deskripsi"
              rows="6"
              :class="kelasInput"
            ></textarea>
          </FormField>
        </div>
        <FormField id="latitude" label="Latitude (contoh: -5.77)" :error="errors.latitude">
          <input
            id="latitude"
            v-model="form.latitude"
            type="number"
            step="any"
            :class="kelasInput"
          />
        </FormField>
        <FormField id="longitude" label="Longitude (contoh: 105.17)" :error="errors.longitude">
          <input
            id="longitude"
            v-model="form.longitude"
            type="number"
            step="any"
            :class="kelasInput"
          />
        </FormField>
        <div class="sm:col-span-2">
          <ImageField v-model="form.gambar" :url-lama="detail?.gambar_url" :error="errors.gambar" />
        </div>

        <div class="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            :disabled="menyimpan"
            class="rounded-md bg-primary px-5 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
          >
            {{ menyimpan ? 'Menyimpan...' : mode === 'ubah' ? 'Simpan Perubahan' : 'Simpan' }}
          </button>
          <RouterLink :to="{ name: 'admin-biota' }" class="text-sm text-slate-600 hover:underline"
            >Batal</RouterLink
          >
        </div>
      </form>
    </StateBlock>
  </section>
</template>
