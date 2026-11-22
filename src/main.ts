import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './app/App.vue';
import router from './app/router';
import { reveal } from './shared/directives/reveal';
import './shared/styles/main.scss';

createApp(App).use(createPinia()).use(router).directive('reveal', reveal).mount('#app');
