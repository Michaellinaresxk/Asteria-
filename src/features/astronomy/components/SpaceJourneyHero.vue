<script setup lang="ts">
import { JOURNEY_STOPS } from '../data/journeyStops';
import { useSpaceJourney } from '../composables/useSpaceJourney';
import SpaceJourneyScene from './SpaceJourneyScene.vue';

const { pose, progress, activeStop, activeStopIndex, goToStop } = useSpaceJourney();
</script>

<template>
  <section class="journey-hero" aria-label="Recorrido virtual por el sistema solar">
    <SpaceJourneyScene :pose="pose" :progress="progress" />

    <div class="journey-content">
      <p class="journey-eyebrow">{{ activeStop.eyebrow }}</p>
      <Transition name="journey-text" mode="out-in">
        <div :key="activeStop.id" class="journey-copy">
          <h1>{{ activeStop.title }}</h1>
          <p>{{ activeStop.description }}</p>
        </div>
      </Transition>

      <div class="journey-actions">
        <p class="journey-hint">Mueve el mouse y desliza para viajar <span aria-hidden="true">↓</span></p>
        <div class="journey-stops" role="group" aria-label="Ir a una etapa del recorrido">
          <button
            v-for="(stop, index) in JOURNEY_STOPS"
            :key="stop.id"
            type="button"
            class="journey-stop"
            :class="{ active: index === activeStopIndex }"
            :aria-label="`Ir a ${stop.title}`"
            :aria-current="index === activeStopIndex ? 'step' : undefined"
            @click="goToStop(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.journey-hero {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 84px);
  min-height: calc(100svh - 84px);
  display: flex;
  align-items: flex-end;
  padding: 0 0 clamp(40px, 8vh, 90px);
  overflow: hidden;
}

.journey-content {
  position: relative;
  z-index: 2;
  width: min(100%, 820px);
  color: #f5f7ff;
  text-shadow: 0 2px 18px rgba(2, 5, 15, 0.85);
}

.journey-eyebrow {
  margin: 0 0 10px;
  color: #7dd3fc;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.journey-copy {
  min-height: 150px;

  h1 {
    margin: 0 0 12px;
    font-size: clamp(2.4rem, 9vw, 4.4rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    max-width: 58ch;
    font-size: clamp(1rem, 2.2vw, 1.2rem);
    line-height: 1.55;
    color: rgba(245, 247, 255, 0.9);
  }
}

.journey-actions {
  margin-top: 26px;
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .journey-hero { padding-bottom: 56px; }
  .journey-copy { min-height: 130px; }
  .journey-actions { flex-direction: column; align-items: flex-start; gap: 14px; }
}

.journey-hint {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(245, 247, 255, 0.72);

  span {
    display: inline-block;
    margin-left: 4px;
    color: #7dd3fc;
    animation: journey-bob 1.8s ease-in-out infinite;
  }
}

.journey-stops {
  display: flex;
  gap: 8px;
}

.journey-stop {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: rgba(5, 10, 25, 0.45);
  color: transparent;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;

  &::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    margin: auto;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }

  &:hover { transform: translateY(-2px); }
  &.active {
    border-color: rgba(125, 211, 252, 0.7);
    background: rgba(125, 211, 252, 0.16);
  }
  &.active::after { background: #7dd3fc; }
  &:focus-visible { outline: 2px solid #7dd3fc; outline-offset: 2px; }
}

.journey-text-enter-active,
.journey-text-leave-active { transition: opacity 0.28s ease, transform 0.28s ease; }
.journey-text-enter-from { opacity: 0; transform: translateY(12px); }
.journey-text-leave-to { opacity: 0; transform: translateY(-8px); }

@keyframes journey-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

@media (prefers-reduced-motion: reduce) {
  .journey-hint span { animation: none; }
  .journey-text-enter-active,
  .journey-text-leave-active { transition: none; }
  .journey-stop { transition: none; }
}
</style>
