import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // ---- state ----
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)
  const ready = ref(false)   // sudah mencoba memulihkan sesi? (guard menunggu ini)

  // ---- getter ----
  const isLoggedIn = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ---- action ----
  function setSession(tokenBaru, userBaru) {
    token.value = tokenBaru
    user.value = userBaru
    localStorage.setItem('token', tokenBaru)
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function login(payload) {
    const body = await authApi.login(payload)
    setSession(body.data.token, body.data.user)
  }

  async function register(payload) {
    const body = await authApi.register(payload)
    setSession(body.data.token, body.data.user)
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Gagal memanggil API (misalnya token sudah kedaluwarsa) tidak boleh menahan pengguna keluar.
    } finally {
      clearSession()
    }
  }

  // Dipanggil sekali saat aplikasi dibuka atau halaman di-refresh: token ada, tetapi data user belum.
  async function restore() {
    if (token.value) {
      try {
        const body = await authApi.me()
        user.value = body.data
      } catch {
        clearSession()   // token tidak valid atau kedaluwarsa
      }
    }
    ready.value = true
  }

  return { token, user, ready, isLoggedIn, isAdmin, login, register, logout, restore, clearSession }
})