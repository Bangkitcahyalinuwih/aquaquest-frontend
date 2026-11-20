<script setup>
import { reactive, ref } from 'vue'
import FormField from '@/components/ui/FormField.vue'
import { updateProfil } from '@/api/profil'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { errorMessage, validationErrors } from '@/utils/errors'

const auth = useAuthStore()
const toast = useToastStore()

const form = reactive({ name: auth.user.name, current_password: '', password: '', password_confirmation: '' })
const errors = ref({})
const loading = ref(false)

async function submit() {
  loading.value = true
  errors.value = {}

  // Kirim kolom kata sandi hanya bila pengguna mengisinya (kontrak: ketiganya harus ada bersama).
  const payload = { name: form.name }
  if (form.password) {
    payload.current_password = form.current_password
    payload.password = form.password
    payload.password_confirmation = form.password_confirmation
  }

  try {
    const body = await updateProfil(payload)
    auth.updateUser(body.data) // navbar langsung memakai nama baru
    form.current_password = form.password = form.password_confirmation = ''
    toast.success('Profil berhasil diperbarui.')
  } catch (e) {
    errors.value = validationErrors(e)
    if (!Object.keys(errors.value).length) toast.error(errorMessage(e))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-xl px-4 py-8">
    <h1 class="text-2xl font-bold text-primary">Profil</h1>

    <div class="mt-4 grid grid-cols-3 gap-3 text-center">
      <div class="rounded-lg bg-white p-3 shadow"><p class="text-xl font-bold text-primary">{{ auth.user.level }}</p><p class="text-xs text-slate-500">Level</p></div>
      <div class="rounded-lg bg-white p-3 shadow"><p class="text-xl font-bold text-primary">{{ auth.user.total_xp }}</p><p class="text-xs text-slate-500">Total XP</p></div>
      <div class="col-span-1 rounded-lg bg-white p-3 shadow"><p class="truncate text-sm font-semibold text-primary">{{ auth.user.email }}</p><p class="text-xs text-slate-500">Email</p></div>
    </div>

    <form class="mt-6 space-y-4 rounded-lg bg-white p-6 shadow" @submit.prevent="submit">
      <FormField id="name" label="Nama" :error="errors.name">
        <input id="name" v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
      </FormField>

      <fieldset class="space-y-4 border-t pt-4">
        <legend class="text-sm font-semibold text-slate-700">Ganti kata sandi (kosongkan bila tidak ingin mengganti)</legend>
        <FormField id="current_password" label="Kata sandi saat ini" :error="errors.current_password">
          <input id="current_password" v-model="form.current_password" type="password" autocomplete="current-password" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>
        <FormField id="password" label="Kata sandi baru (minimal 8 karakter)" :error="errors.password">
          <input id="password" v-model="form.password" type="password" autocomplete="new-password" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>
        <FormField id="password_confirmation" label="Ulangi kata sandi baru" :error="errors.password_confirmation">
          <input id="password_confirmation" v-model="form.password_confirmation" type="password" autocomplete="new-password" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>
      </fieldset>

      <button type="submit" :disabled="loading" class="rounded-md bg-primary px-5 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60">
        {{ loading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </form>
  </section>
</template>
