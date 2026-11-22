<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div id="app-shell">
    <nav class="nav" aria-label="Navegación principal">
      <RouterLink to="/" class="nav-link">Hoy</RouterLink>
      <RouterLink to="/eventos" class="nav-link">Eventos</RouterLink>
      <RouterLink to="/planetas" class="nav-link">Planetas</RouterLink>
      <RouterLink to="/aprende" class="nav-link">Aprende</RouterLink>
      <RouterLink to="/calculadora" class="nav-link">Calculadora</RouterLink>
      <RouterLink to="/about" class="nav-link">About</RouterLink>
    </nav>
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

.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: rgba(8, 14, 32, 0.55);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

@media (min-width: 640px) {
  .nav { justify-content: center; }
}

.nav-link {
  color: rgba(245, 247, 255, 0.82);
  text-decoration: none;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 999px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
  &.router-link-exact-active {
    background: rgba(125, 211, 252, 0.18);
    color: #7dd3fc;
  }
}

.main-content {
  padding: 20px 16px 40px;
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
  .page-leave-active,
  .nav-link {
    transition: none;
  }
}
</style>
