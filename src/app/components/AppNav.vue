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
  { to: '/about', label: 'About' },
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
          >
            Más
            <svg class="chevron" :class="{ rotated: moreOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <Transition name="drop">
            <div v-if="moreOpen" class="dropdown">
              <RouterLink v-for="link in moreLinks" :key="link.to" :to="link.to" class="dropdown-link">{{ link.label }}</RouterLink>
            </div>
          </Transition>
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
          <p class="group-label">Más secciones</p>
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
  z-index: 50;
  background: rgba(11, 16, 32, 0.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #f8fafc;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}
.brand-mark { color: #7dd3fc; font-size: 1.1rem; }
.brand-name { color: #f8fafc; }

.menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  color: #f8fafc;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease;
}
.menu-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }

.menu-icon { width: 20px; height: 14px; position: relative; display: inline-block; }
.menu-icon span { position: absolute; left: 0; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transition: transform .2s ease, opacity .2s ease, top .2s ease; }
.menu-icon span:nth-child(1) { top: 0; }
.menu-icon span:nth-child(2) { top: 6px; }
.menu-icon span:nth-child(3) { top: 12px; }
.menu-icon.open span:nth-child(1) { top: 6px; transform: rotate(45deg); }
.menu-icon.open span:nth-child(2) { opacity: 0; }
.menu-icon.open span:nth-child(3) { top: 6px; transform: rotate(-45deg); }

.desktop-links { display: none; align-items: center; gap: 2px; }

.nav-link {
  color: rgba(248, 250, 252, 0.82);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.92rem;
  padding: 8px 12px;
  border-radius: 8px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  transition: color .15s ease, background .15s ease;
}
.nav-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
.nav-link.router-link-exact-active {
  background: rgba(125, 211, 252, 0.14);
  color: #7dd3fc;
}

.more-wrap { position: relative; }
.more-btn { font-family: inherit; }
.chevron { transition: transform .2s ease; opacity: 0.7; }
.chevron.rotated { transform: rotate(180deg); }

.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 200px;
  padding: 6px;
  background: #141b2d;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
}

.dropdown-link {
  color: rgba(248,250,252,0.88);
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.92rem;
  transition: background .15s ease, color .15s ease;
}
.dropdown-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
.dropdown-link.router-link-exact-active { background: rgba(125,211,252,0.14); color: #7dd3fc; }

.mobile-menu {
  padding: 4px 16px 16px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 4px;
  background: rgba(11, 16, 32, 0.98);
  border-top: 1px solid rgba(255,255,255,0.06);
}

.mobile-group { padding: 10px 0 2px; }
.mobile-group + .mobile-group { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; }

.group-label {
  margin: 0 0 4px;
  padding: 0 12px;
  color: rgba(148, 163, 184, 0.9);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mobile-link {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(248,250,252,0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background .15s ease, color .15s ease;
}
.mobile-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
.mobile-link.router-link-exact-active { background: rgba(125,211,252,0.14); color: #7dd3fc; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

.menu-enter-active, .menu-leave-active { transition: opacity .2s ease, transform .2s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }
.drop-enter-active, .drop-leave-active { transition: opacity .15s ease, transform .15s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-4px); }

@media (min-width: 960px) {
  .menu-btn { display: none; }
  .desktop-links { display: flex; }
  .mobile-menu { display: none !important; }
}

@media (prefers-reduced-motion: reduce) {
  .menu-icon span, .menu-enter-active, .menu-leave-active, .drop-enter-active, .drop-leave-active, .nav-link, .mobile-link, .dropdown-link { transition: none; }
}
</style>
