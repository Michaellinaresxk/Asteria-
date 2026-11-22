import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/features/weight-calculator/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/features/weight-calculator/views/AboutView.vue'),
    },
  ],
});

export default router;
