<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePlanetStore } from '@/app/stores/planetStore';
import WeightResult from './WeightResult.vue';

const planetStore = usePlanetStore();

const yourWeight = ref<number | null>(null);
const planetChosen = ref<string>('');
const result = ref<number | null>(null);

const planetNames = computed(() => Object.keys(planetStore.planets));

function calcWeight() {
  if (yourWeight.value === null || !planetChosen.value) return;
  const gravity = planetStore.planets[planetChosen.value];
  result.value = Math.round((yourWeight.value * gravity) / planetStore.earthGravity);
}
</script>

<template>
  <section class="calculator container">
    <form class="calculator-form" @submit.prevent="calcWeight">
      <label class="field">
        <span class="field-label">Your weight (kg)</span>
        <input
          id="weight"
          v-model.number="yourWeight"
          type="number"
          min="0"
          step="any"
          placeholder="Place your weight here"
          required
        >
      </label>

      <label class="field">
        <span class="field-label">Planet</span>
        <select id="chooseYourPlanet" v-model="planetChosen" class="form-control" required>
          <option disabled value="">Select a planet</option>
          <option v-for="planet in planetNames" :key="planet" :value="planet">
            {{ planet }}
          </option>
        </select>
      </label>

      <button type="submit" class="btn bg-primary submit-btn">Make calculation</button>
    </form>

    <WeightResult v-if="result !== null && planetChosen" :planet-chosen="planetChosen">
      Your weight on {{ planetChosen }} is: {{ result }} kg.
    </WeightResult>
  </section>
</template>

<style lang="scss" scoped>
.calculator {
  max-width: 560px;
}

.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.field-label {
  color: #fff;
  font-weight: 600;
}

#weight,
.form-control {
  width: 100%;
  color: #fff;
  font-size: 1.1rem;
}

.form-control option {
  color: #333;
  text-transform: capitalize;
}

.submit-btn {
  width: 100%;
  min-height: 44px;
}
</style>
