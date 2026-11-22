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
