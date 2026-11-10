import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/biota', name: 'biota', component: () => import('@/pages/BiotaListPage.vue') },
  { path: '/biota/:slug', name: 'biota-detail', component: () => import('@/pages/BiotaDetailPage.vue') },
  { path: '/edukasi', name: 'edukasi', component: () => import('@/pages/EdukasiListPage.vue') },
  { path: '/edukasi/:slug', name: 'edukasi-detail', component: () => import('@/pages/EdukasiDetailPage.vue') },
  { path: '/leaderboard', name: 'leaderboard', component: () => import('@/pages/LeaderboardPage.vue') },

  { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('@/pages/RegisterPage.vue'), meta: { guestOnly: true } },

  { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue'), meta: { requiresAuth: true } },
  { path: '/kuis', name: 'kuis', component: () => import('@/pages/KuisPage.vue'), meta: { requiresAuth: true } },
  { path: '/koleksi', name: 'koleksi', component: () => import('@/pages/KoleksiPage.vue'), meta: { requiresAuth: true } },
  { path: '/profil', name: 'profil', component: () => import('@/pages/ProfilPage.vue'), meta: { requiresAuth: true } },

  { path: '/admin', name: 'admin-dashboard', component: () => import('@/pages/admin/AdminDashboardPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/biota', name: 'admin-biota', component: () => import('@/pages/admin/AdminBiotaPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edukasi', name: 'admin-edukasi', component: () => import('@/pages/admin/AdminEdukasiPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/soal', name: 'admin-soal', component: () => import('@/pages/admin/AdminSoalPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/kartu', name: 'admin-kartu', component: () => import('@/pages/admin/AdminKartuPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/403', name: 'forbidden', component: () => import('@/pages/ForbiddenPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Guard: dijalankan sebelum setiap perpindahan halaman.
// PENTING: ini hanya kenyamanan tampilan. Pengamanan sebenarnya ada di API (401 dan 403).
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Saat halaman baru dibuka atau di-refresh, pulihkan sesi dari token sebelum memutuskan apa pun.
  if (!auth.ready) await auth.restore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }   // ingat tujuan semula
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'forbidden' }
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: auth.isAdmin ? 'admin-dashboard' : 'dashboard' }
  }
})

export default router