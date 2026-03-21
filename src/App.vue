<template>
  <AppHeader />
  <div class="main-content">
    <router-view />
  </div>
  <AppFooter />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AuthService from './services/AuthService';

const route = useRoute();
const router = useRouter();
const isLoggedIn = ref(false); // Все еще используем для других целей, например, показа/скрытия элементов
const authChecked = ref(false);

const updateAuthStatus = async () => {
  try {
    await AuthService.getMe();
    isLoggedIn.value = true;
  } catch (error) {
    isLoggedIn.value = false;
  } finally {
    authChecked.value = true;
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
