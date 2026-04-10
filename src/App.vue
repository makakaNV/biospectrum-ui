<template>
  <AppHeader />
  <div class="main-content">
    <router-view />
  </div>
  <AppFooter />

  <!-- Попап: бэкенд недоступен -->
  <div v-if="backendDown" class="outage-overlay" @click.self="backendDown = false">
    <div class="outage-modal">
      <div class="outage-icon">
        <i class="pi pi-exclamation-triangle"></i>
      </div>
      <h2 class="outage-title">Технические работы</h2>
      <p class="outage-text">
        В данный момент сервер временно недоступен, некоторые функции временно не работают - технические работы
        на стороне хостинг-провайдера.
      </p>
      <p class="outage-subtext">Попробуйте зайти позже.</p>
      <button class="outage-btn" @click="backendDown = false">Понятно</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AuthService from './services/AuthService';
import { isLoggedIn } from './stores/auth';
import apiClient from './services/api';

const route = useRoute();
const router = useRouter();
const backendDown = ref(false);

const checkBackend = async () => {
  try {
    await apiClient.get('/categories/all', { params: { page: 0, limit: 1 }, timeout: 5000 });
    // Любой ответ бэкенд жив
  } catch (error) {
    // error.response означает, что сервер ответил (пусть даже ошибкой) - он жив
    // Отсутствие error.response означает network error / timeout - бэкенд недоступен
    if (!error.response) {
      backendDown.value = true;
    }
  }
};

const updateAuthStatus = async () => {
  try {
    await AuthService.getMe();
    isLoggedIn.value = true;
  } catch (error) {
    if (error.response?.status === 401) {
      isLoggedIn.value = false;
      localStorage.removeItem('authToken');
    }
  }
};

onMounted(() => {
  checkBackend();
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

/* ── Попап технических работ ── */
.outage-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.outage-modal {
  background: #ffffff;
  border-radius: 18px;
  padding: 2.5rem 2rem 2rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
  animation: outage-in 0.25s ease;
}

@keyframes outage-in {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

.outage-icon {
  width: 64px;
  height: 64px;
  background: #fff7ed;
  border: 2px solid #fed7aa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.outage-icon .pi {
  font-size: 1.75rem;
  color: #ea580c;
}

.outage-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.875rem;
}

.outage-text {
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 0.625rem;
}

.outage-subtext {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0 0 1.75rem;
}

.outage-btn {
  display: inline-block;
  padding: 0.625rem 2rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}

.outage-btn:hover {
  background: #1d4ed8;
}
</style>
