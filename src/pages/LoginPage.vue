<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import FormField from '@/components/ui/FormField.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { errorMessage, validationErrors } from '@/utils/errors'

const auth = useAuthStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const errors = ref({})
const loading = ref(false)

function tujuanSetelahLogin() {
  const tujuan = route.query.redirect
  // Hanya terima alamat internal (diawali satu "/"), supaya parameter ini tidak bisa dipakai untuk
  // membelokkan pengguna ke situs lain (open redirect).
  if (typeof tujuan === 'string' && tujuan.startsWith('/') && !tujuan.startsWith('//')) return tujuan
  return { name: auth.isAdmin ? 'admin-dashboard' : 'dashboard' }
}

async function submit() {
  loading.value = true
  errors.value = {}
  try {
    await auth.login(form)
    toast.success(`Selamat datang, ${auth.user.name}!`)
    router.push(tujuanSetelahLogin())
  } catch (e) {
    errors.value = validationErrors(e)   // 422: tampilkan di bawah kolom
    if (!Object.keys(errors.value).length) toast.error(errorMessage(e))   // galat lain: toast
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md px-4 py-12">
    <div class="rounded-lg bg-white p-6 shadow">
      <h1 class="text-2xl font-bold text-primary">Masuk</h1>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <FormField id="email" label="Email" :error="errors.email">
          <input id="email" v-model="form.email" type="email" required autocomplete="email"
                 class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>

        <FormField id="password" label="Kata sandi" :error="errors.password">
          <input id="password" v-model="form.password" type="password" required autocomplete="current-password"
                 class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary" />
        </FormField>

        <button type="submit" :disabled="loading"
                class="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-slate-600">
        Belum punya akun? <RouterLink :to="{ name: 'register' }" class="text-primary underline">Daftar</RouterLink>
      </p>
      <p class="mt-2 text-xs text-slate-400">Mode mock: demo@aquaquest.test atau admin@aquaquest.test, kata sandi password.</p>
    </div>
  </section>
</template>