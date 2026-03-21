import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'; // Импортируем роутер
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css'; // Импортируем PrimeFlex

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(router); // Подключаем роутер

app.mount('#app')
