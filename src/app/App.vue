<script setup lang="ts">
import { RouterView } from 'vue-router';

import AppNav from './components/AppNav.vue';
</script>

<template>
  <div id="app-shell">
    <AppNav />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style lang="scss">
#app-shell {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(5, 10, 25, 0.35), rgba(5, 10, 25, 0.65)),
    url('https://backiee.com/static/wpdb/wallpapers/7680x4320/217772.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #f5f7ff;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-content {
  padding: 24px 16px 40px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
