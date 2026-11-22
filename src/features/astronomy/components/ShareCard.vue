<script setup lang="ts">
import { computed, ref } from 'vue';

import { getEventsForDate } from '../data/dailyEvents';
import { getMoonPhase } from '../utils/moonPhase';
import { buildShareText } from '../utils/share';

const copied = ref(false);
const moon = computed(() => getMoonPhase(new Date()));
const nextEvent = computed(() => getEventsForDate(new Date(), 14)[0]);
const shareText = computed(() => buildShareText(new Date(), moon.value, nextEvent.value));

async function share() {
  copied.value = false;
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Hoy en el cielo', text: shareText.value });
      return;
    }
  } catch {
    // user cancelled or share failed; fall back to clipboard
  }

  try {
    await navigator.clipboard.writeText(shareText.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    // ignore
  }
}
</script>

<template>
  <article class="card share-card">
    <p class="eyebrow">Compartir</p>
    <h2>Lleva el cielo contigo</h2>
    <p class="preview">{{ shareText }}</p>
    <button class="share-btn" type="button" @click="share">
      {{ copied ? 'Copiado' : 'Compartir resumen' }}
    </button>
  </article>
</template>

<style scoped lang="scss">
.card {
  background: rgba(10, 18, 40, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  color: #f5f7ff;
  text-align: left;
  animation: fade-up 0.5s ease 0.25s both;
}
.eyebrow { margin: 0; color: #f9a8d4; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
h2 { margin: 6px 0 12px; font-size: clamp(1.2rem, 4vw, 1.6rem); }
.preview { white-space: pre-line; line-height: 1.6; color: rgba(245,247,255,0.86); font-size: 0.92rem; margin: 0 0 16px; }
.share-btn {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(90deg, #7dd3fc, #a78bfa);
  color: #081225;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.share-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
.share-btn:active { transform: translateY(0); }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .card, .share-btn { animation: none; transition: none; } }
</style>
