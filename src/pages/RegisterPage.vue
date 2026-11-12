<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import FormField from '@/components/ui/FormField.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { errorMessage, validationErrors } from '@/utils/errors'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const errors = ref({})
const loading = ref(false)

async function submit() {
  loading.value = true
  errors.value = {}
  try {
    await auth.register(form)   // setelah berhasil, pengguna otomatis login
    toast.success('Akun berhasil dibuat. Selamat datang!')
    router.push({ name: 'dashboard' })
  } catch (e) {
    errors.value = validationErrors(e)
    if (!Object.keys(errors.value).length) toast.error(errorMessage(e))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md px-4 py-12">
    <div class="rounded-lg bg-white p-6 shadow">
      <h1 class="text-2xl font-bold text-primary">Daftar</h1>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <FormField id="name" label="Nama" :error="errors.name">
          <input id="name" v-model="form.name" type="text" required autocomplete="name"
                 class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>

        <FormField id="email" label="Email" :error="errors.email">
          <input id="email" v-model="form.email" type="email" required autocomplete="email"
                 class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>

        <FormField id="password" label="Kata sandi (minimal 8 karakter)" :error="errors.password">
          <input id="password" v-model="form.password" type="password" required autocomplete="new-password"
                 class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>

        <FormField id="password_confirmation" label="Ulangi kata sandi" :error="errors.password_confirmation">
          <input id="password_confirmation" v-model="form.password_confirmation" type="password" required autocomplete="new-password"
                 class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>

        <button type="submit" :disabled="loading"
                class="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60">
          {{ loading ? 'Memproses...' : 'Daftar' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-slate-600">
        Sudah punya akun? <RouterLink :to="{ name: 'login' }" class="text-primary underline">Masuk</RouterLink>
      </p>
    </div>
  </section>
</template>