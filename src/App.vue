<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/layout/NavBar.vue'
import FooterBar from '@/components/layout/FooterBar.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface text-slate-900">
    <NavBar />
    <main class="flex-1">
      <RouterView />
    </main>
    <FooterBar />
    <ToastHost />
  </div>
</template>