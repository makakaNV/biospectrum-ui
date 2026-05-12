<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="declined-header">
        <div class="declined-icon-wrap">
          <i class="pi pi-question-circle"></i>
        </div>
        <h1 class="auth-title">Ссылка недействительна</h1>
      </div>

      <div class="declined-body">
        <p class="declined-hint">
          Возможно, аккаунт уже был подтверждён ранее
          или срок действия ссылки истёк.
        </p>

        <ul class="scenarios">
          <li>Войдите в аккаунт, если уже подтверждали email.</li>
          <li>Зарегистрируйтесь заново, если нет.</li>
        </ul>

        <div class="action-btns">
          <button class="btn-primary" @click="router.push('/login')">
            Войти
          </button>
          <button class="btn-secondary" @click="router.push('/register')">
            Зарегистрироваться заново
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
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

.declined-header {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  padding: 2rem 2rem 1.75rem;
  text-align: center;
  border-bottom: 1px solid #fed7aa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.declined-icon-wrap {
  width: 56px;
  height: 56px;
  background: #fed7aa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ea580c;
  margin-bottom: 0.25rem;
}

.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.declined-body {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.declined-hint {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.scenarios {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.25rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  background: #ffffff;
  color: #475569;
  font-family: inherit;
  transition: border-color 0.2s, color 0.2s;
}

.btn-secondary:hover {
  border-color: #94a3b8;
  color: #1e293b;
}
</style>
