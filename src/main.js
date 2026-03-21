import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import router from './router';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const BluePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    }
  }
});

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: BluePreset,
    options: {
      darkModeSelector: '.app-dark' // отключаем авто-тёмную тему
    }
  }
});
app.use(router);

app.mount('#app')
