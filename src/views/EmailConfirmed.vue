<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="confirmed-header">
        <div class="confirmed-icon-wrap">
          <i class="pi pi-check"></i>
        </div>
        <h1 class="auth-title">Email подтверждён</h1>
      </div>

      <div class="confirmed-body">
        <p class="confirmed-hint">
          Через несколько секунд вы будете перенаправлены на страницу входа.
        </p>
        <div class="redirect-indicator">
          <i class="pi pi-spin pi-spinner"></i>
          <span>Переход через {{ countdown }} сек.</span>
        </div>
        <router-link to="/login" class="login-link">Войти</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const countdown = ref(5);
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push('/login');
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(30, 64, 175, 0.07);
  overflow: hidden;
}

.confirmed-header {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 2rem 2rem 1.75rem;
  text-align: center;
  border-bottom: 1px solid #bbf7d0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.confirmed-icon-wrap {
  width: 56px;
  height: 56px;
  background: #bbf7d0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #16a34a;
  margin-bottom: 0.25rem;
}

.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.confirmed-body {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  text-align: center;
}

.confirmed-hint {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.redirect-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.login-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
