<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { biotaAdmin } from '@/api/adminBiota'
import { soalAdmin } from '@/api/adminSoal'
import { useAdminForm } from '@/composables/useAdminForm'
import FormField from '@/components/ui/FormField.vue'
import ImageField from '@/components/ui/ImageField.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const { mode, form, errors, memuat, menyimpan, galatMuat, detail, simpan, muatData } = useAdminForm({
  api: soalAdmin,
  rutDaftar: 'admin-soal',
  awal: { biota_id: '', tipe: 'teks', pertanyaan: '', opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', jawaban_benar: 'a', poin: 10, gambar: null },
})

const huruf = ['a', 'b', 'c', 'd']
const daftarBiota = ref([])
biotaAdmin.opsi().then((body) => (daftarBiota.value = body.data)).catch(() => (daftarBiota.value = []))

const kelasInput = 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary'
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <h1 class="text-2xl font-bold text-primary">{{ mode === 'ubah' ? 'Ubah Soal' : 'Tambah Soal' }}</h1>

    <StateBlock :loading="memuat" :error="galatMuat" @retry="muatData">
      <form class="mt-6 space-y-4 rounded-lg bg-white p-6 shadow" @submit.prevent="simpan">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="tipe" label="Tipe soal" :error="errors.tipe">
            <select id="tipe" v-model="form.tipe" :class="kelasInput">
              <option value="teks">Teks</option>
              <option value="gambar">Tebak gambar</option>
            </select>
          </FormField>
          <FormField id="biota_id" label="Biota terkait (opsional)" :error="errors.biota_id">
            <select id="biota_id" v-model="form.biota_id" :class="kelasInput">
              <option value="">Soal umum</option>
              <option v-for="b in daftarBiota" :key="b.id" :value="b.id">{{ b.nama }}</option>
            </select>
          </FormField>
        </div>

        <FormField id="pertanyaan" label="Pertanyaan" :error="errors.pertanyaan">
          <textarea id="pertanyaan" v-model="form.pertanyaan" rows="3" :class="kelasInput"></textarea>
        </FormField>

        <!-- Kolom gambar hanya muncul untuk soal tebak gambar -->
        <ImageField v-if="form.tipe === 'gambar'" v-model="form.gambar" label="Gambar soal (wajib untuk tebak gambar)" :url-lama="detail?.gambar_url" :error="errors.gambar" />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField v-for="o in huruf" :id="`opsi_${o}`" :key="o" :label="`Opsi ${o.toUpperCase()}`" :error="errors[`opsi_${o}`]">
            <input :id="`opsi_${o}`" v-model="form[`opsi_${o}`]" type="text" :class="kelasInput" />
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <FormField id="jawaban_benar" label="Jawaban benar" :error="errors.jawaban_benar">
            <select id="jawaban_benar" v-model="form.jawaban_benar" :class="kelasInput">
              <option v-for="o in huruf" :key="o" :value="o">{{ o.toUpperCase() }}</option>
            </select>
          </FormField>
          <FormField id="poin" label="Poin (1 sampai 100)" :error="errors.poin">
            <input id="poin" v-model="form.poin" type="number" min="1" max="100" :class="kelasInput" />
          </FormField>
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" :disabled="menyimpan" class="rounded-md bg-primary px-5 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60">
            {{ menyimpan ? 'Menyimpan...' : mode === 'ubah' ? 'Simpan Perubahan' : 'Simpan' }}
          </button>
          <RouterLink :to="{ name: 'admin-soal' }" class="text-sm text-slate-600 hover:underline">Batal</RouterLink>
        </div>
      </form>
    </StateBlock>
  </section>
</template>
