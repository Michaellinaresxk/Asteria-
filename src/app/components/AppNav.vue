<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const open = ref(false);
const moreOpen = ref(false);
const moreWrap = ref<HTMLElement | null>(null);

const primaryLinks = [
  { to: '/', label: 'Hoy' },
  { to: '/cielo', label: 'Cielo' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/planetas', label: 'Planetas' },
  { to: '/iss', label: 'ISS' },
];

const moreLinks = [
  { to: '/constelaciones', label: 'Guía' },
  { to: '/aprende', label: 'Aprende' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/calculadora', label: 'Calculadora' },
];

watch(() => route.fullPath, () => {
  open.value = false;
  moreOpen.value = false;
});

function toggleMenu() {
  open.value = !open.value;
  moreOpen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false;
    moreOpen.value = false;
  }
}

function onDocumentClick(e: MouseEvent) {
  if (moreWrap.value && !moreWrap.value.contains(e.target as Node)) {
    moreOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick));
onUnmounted(() => document.removeEventListener('click', onDocumentClick));
</script>

<template>
  <nav class="app-nav" aria-label="Navegación principal" @keydown="onKeydown">
    <div class="nav-inner">
      <RouterLink to="/" class="brand" aria-label="Asteria inicio">
        <span class="brand-mark">✦</span>
        <span class="brand-name">Asteria</span>
      </RouterLink>

      <button
        class="menu-btn"
        type="button"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="mobile-menu"
        @click="toggleMenu"
      >
        <span class="sr-only">Menú</span>
        <span class="menu-icon" :class="{ open }"><span></span><span></span><span></span></span>
      </button>

      <div class="desktop-links">
        <RouterLink v-for="link in primaryLinks" :key="link.to" :to="link.to" class="nav-link">{{ link.label }}</RouterLink>
        <div ref="moreWrap" class="more-wrap">
          <button
            class="nav-link more-btn"
            type="button"
            :aria-expanded="moreOpen ? 'true' : 'false'"
            @click="moreOpen = !moreOpen"
          >Más</button>
          <div v-if="moreOpen" class="dropdown">
            <RouterLink v-for="link in moreLinks" :key="link.to" :to="link.to" class="dropdown-link">{{ link.label }}</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <Transition name="menu">
      <div v-if="open" id="mobile-menu" class="mobile-menu">
        <div class="mobile-group">
          <p class="group-label">Explorar</p>
          <RouterLink v-for="link in primaryLinks" :key="link.to" :to="link.to" class="mobile-link">{{ link.label }}</RouterLink>
        </div>
        <div class="mobile-group">
          <p class="group-label">Más</p>
          <RouterLink v-for="link in moreLinks" :key="link.to" :to="link.to" class="mobile-link">{{ link.label }}</RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped lang="scss">
.app-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(8, 14, 32, 0.72);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: #f5f7ff; font-weight: 700; font-size: 1.2rem; }
.brand-mark { color: #7dd3fc; filter: drop-shadow(0 0 8px rgba(125,211,252,0.5)); }
.menu-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,0.14); border-radius: 12px; background: rgba(255,255,255,0.04); color: #fff; cursor: pointer; }
.menu-icon { width: 20px; height: 14px; position: relative; display: inline-block; }
.menu-icon span { position: absolute; left: 0; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transition: transform .2s ease, opacity .2s ease, top .2s ease; }
.menu-icon span:nth-child(1) { top: 0; }
.menu-icon span:nth-child(2) { top: 6px; }
.menu-icon span:nth-child(3) { top: 12px; }
.menu-icon.open span:nth-child(1) { top: 6px; transform: rotate(45deg); }
.menu-icon.open span:nth-child(2) { opacity: 0; }
.menu-icon.open span:nth-child(3) { top: 6px; transform: rotate(-45deg); }
.desktop-links { display: none; align-items: center; gap: 4px; }
.nav-link { color: rgba(245,247,255,0.84); text-decoration: none; font-weight: 600; padding: 10px 12px; border-radius: 10px; min-height: 44px; display: inline-flex; align-items: center; background: transparent; border: 0; cursor: pointer; font: inherit; }
.nav-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-link.router-link-exact-active { background: rgba(125,211,252,0.16); color: #7dd3fc; }
.more-wrap { position: relative; }
.dropdown { position: absolute; right: 0; top: calc(100% + 8px); min-width: 180px; padding: 8px; background: rgba(10,18,40,0.96); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.35); display: flex; flex-direction: column; gap: 2px; }
.dropdown-link { color: rgba(245,247,255,0.88); text-decoration: none; padding: 10px 12px; border-radius: 10px; font-weight: 500; }
.dropdown-link:hover, .dropdown-link.router-link-exact-active { background: rgba(125,211,252,0.14); color: #7dd3fc; }
.mobile-menu { padding: 0 16px 16px; max-width: 1200px; margin: 0 auto; display: grid; gap: 16px; }
.mobile-group { padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); }
.group-label { margin: 0 0 8px; color: rgba(245,247,255,0.56); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; }
.mobile-link { display: flex; align-items: center; min-height: 44px; padding: 10px 12px; border-radius: 12px; color: rgba(245,247,255,0.9); text-decoration: none; font-weight: 600; }
.mobile-link:hover, .mobile-link.router-link-exact-active { background: rgba(125,211,252,0.14); color: #7dd3fc; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.menu-enter-active, .menu-leave-active { transition: opacity .2s ease, transform .2s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-8px); }
@media (min-width: 900px) {
  .menu-btn { display: none; }
  .desktop-links { display: flex; }
  .mobile-menu { display: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .menu-icon span, .menu-enter-active, .menu-leave-active { transition: none; }
}
</style>
