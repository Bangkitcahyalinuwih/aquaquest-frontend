import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Urutan penting: Pinia dipasang SEBELUM router, karena guard router (F2) memakai store.
createApp(App).use(createPinia()).use(router).mount('#app')