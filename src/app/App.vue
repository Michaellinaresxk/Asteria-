<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div id="app-shell">
    <nav class="nav">
      <RouterLink to="/">Home</RouterLink>
      <span class="nav-separator">|</span>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
#app-shell {
  min-height: 100vh;
  background-image: url('https://backiee.com/static/wpdb/wallpapers/7680x4320/217772.jpg');
  background-size: cover;
  background-position: center;
  color: #2c3e50;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.nav {
  padding: 24px 16px;
  display: flex;
  justify-content: center;
  gap: 8px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.nav-separator {
  color: #2c3e50;
}

.main-content {
  padding: 0 16px 32px;
}
</style>
