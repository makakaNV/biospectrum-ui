<template>
  <AppHeader />
  <div class="main-content">
    <router-view />
  </div>
  <AppFooter />
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AuthService from './services/AuthService';
import { isLoggedIn } from './stores/auth';

const route = useRoute();
const router = useRouter();

const updateAuthStatus = async () => {
  try {
    await AuthService.getMe();
    isLoggedIn.value = true;
  } catch (error) {
    // Сбрасываем только при явном 401 — токен невалиден.
    // Сетевые ошибки / CORS / 5xx не должны разлогинивать пользователя.
    if (error.response?.status === 401) {
      isLoggedIn.value = false;
      localStorage.removeItem('authToken');
    }
  }
};

onMounted(() => {
  updateAuthStatus();
});

watch(route, (newRoute, oldRoute) => {
  if (newRoute.path !== oldRoute.path) {
    updateAuthStatus();
  }
});
</script>

<style>
:root {
  --brand-50:  #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-400: #60a5fa;
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;
  --brand-800: #1e40af;
}

/* Глобальные стили можно добавить сюда */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--surface-ground);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
