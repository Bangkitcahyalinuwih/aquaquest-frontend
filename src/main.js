import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { configureHttp } from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())   // Pinia dulu, baru router (guard memakai store)
app.use(router)

// Beri tahu http.js cara mengambil token dan apa yang dilakukan saat 401.
const auth = useAuthStore()
configureHttp({
  getToken: () => auth.token,
  onUnauthorized: () => {
    auth.clearSession()
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  },
})

app.mount('#app')