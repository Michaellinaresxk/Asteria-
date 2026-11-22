import { createRouter, createWebHistory } from 'vue-router';

import AstronomyDashboardView from '@/features/astronomy/views/AstronomyDashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: AstronomyDashboardView,
    },
    {
      path: '/eventos',
      name: 'events',
      component: () => import('@/features/astronomy/views/EventsCalendarView.vue'),
    },
    {
      path: '/cielo',
      name: 'sky',
      component: () => import('@/features/sky/views/VisiblePlanetsView.vue'),
    },
    {
      path: '/planetas',
      name: 'planets',
      component: () => import('@/features/planets/views/PlanetExplorerView.vue'),
    },
    {
      path: '/planetas/:id',
      name: 'planet-detail',
      component: () => import('@/features/planets/views/PlanetDetailView.vue'),
    },
    {
      path: '/aprende',
      name: 'learn',
      component: () => import('@/features/learning/views/LearningHubView.vue'),
    },
    {
      path: '/favoritos',
      name: 'favorites',
      component: () => import('@/features/favorites/views/FavoritesView.vue'),
    },
    {
      path: '/iss',
      name: 'iss',
      component: () => import('@/features/iss/views/IssTrackerView.vue'),
    },
    {
      path: '/constelaciones',
      name: 'constellations',
      component: () => import('@/features/constellations/views/ConstellationGuideView.vue'),
    },
    {
      path: '/calculadora',
      name: 'calculator',
      component: () => import('@/features/weight-calculator/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/features/weight-calculator/views/AboutView.vue'),
    },
  ],
});

export default router;
