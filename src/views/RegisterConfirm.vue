<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="confirm-header">
        <div class="confirm-icon-wrap">
          <i class="pi pi-envelope"></i>
        </div>
        <h1 class="auth-title">Проверьте почту</h1>
        <div class="confirm-email">{{ email }}</div>
      </div>

      <div class="confirm-body">
        <p class="confirm-hint">
          Перейдите по ссылке в письме, чтобы завершить регистрацию.
          Проверьте папку «Спам», если письмо не пришло.
        </p>
        <router-link to="/login" class="back-link">
          <i class="pi pi-arrow-left"></i> Вернуться ко входу
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const email = route.query.email ?? '';
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

.confirm-header {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #dbeafe;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.confirm-icon-wrap {
  width: 56px;
  height: 56px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #2563eb;
  margin-bottom: 0.25rem;
}

.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.confirm-email {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  word-break: break-all;
}

.confirm-body {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  text-align: center;
}

.confirm-hint {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.back-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
