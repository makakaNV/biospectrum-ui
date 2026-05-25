<template>
  <div class="auth-page">
    <div class="auth-card">

      <!-- Успех -->
      <template v-if="sent">
        <div class="recovery-header">
          <div class="header-icon-wrap header-icon-wrap--blue">
            <i class="pi pi-envelope"></i>
          </div>
          <h1 class="auth-title">Письмо отправлено</h1>
        </div>
        <div class="auth-body">
          <p class="body-text">
            Письмо отправлено на <strong class="sent-email">{{ email }}</strong>.
            Перейдите по ссылке в письме, чтобы сбросить пароль.
            Проверьте папку «Спам», если письмо не пришло.
          </p>
          <router-link to="/login" class="back-link">
            <i class="pi pi-arrow-left"></i> Вернуться ко входу
          </router-link>
        </div>
      </template>

      <!-- Форма -->
      <template v-else>
        <div class="recovery-header">
          <div class="header-icon-wrap header-icon-wrap--blue">
            <i class="pi pi-lock"></i>
          </div>
          <h1 class="auth-title">Восстановление пароля</h1>
          <p class="auth-subtitle">Введите email, указанный при регистрации</p>
        </div>

        <div class="auth-body">
          <div class="field-group">
            <label class="field-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="field-input"
              :class="{ 'field-input--error': emailError, 'field-input--valid': email && !emailError }"
              placeholder="you@example.com"
              autocomplete="email"
              @blur="validate"
              @keydown.enter="submit"
            />
            <span v-if="emailError" class="field-error">{{ emailError }}</span>
          </div>

          <div v-if="serverError" class="server-error">
            <i class="pi pi-exclamation-circle"></i>
            {{ serverError }}
          </div>

          <button class="submit-btn" :class="{ 'submit-btn--loading': loading }" @click="submit" :disabled="loading">
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <span>Отправить письмо</span>
          </button>

          <div class="auth-footer">
            <router-link to="/login" class="auth-link">
              <i class="pi pi-arrow-left"></i> Вернуться ко входу
            </router-link>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AuthService from '@/services/AuthService';

const email = ref('');
const emailError = ref('');
const serverError = ref('');
const loading = ref(false);
const sent = ref(false);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate() {
  if (!email.value) {
    emailError.value = 'Введите email';
  } else if (!EMAIL_RE.test(email.value)) {
    emailError.value = 'Некорректный формат email';
  } else {
    emailError.value = '';
  }
  return !emailError.value;
}

const submit = async () => {
  serverError.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    await AuthService.requestPasswordReset(email.value);
    sent.value = true;
  } catch {
    serverError.value = 'Произошла ошибка. Попробуйте ещё раз.';
  } finally {
    loading.value = false;
  }
};
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
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(30, 64, 175, 0.07);
  overflow: hidden;
}

.recovery-header {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #dbeafe;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.header-icon-wrap--blue {
  width: 56px;
  height: 56px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #2563eb;
  margin-bottom: 0.25rem;
}

.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.auth-body {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.body-text {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  background: #f8fafc;
  color: #1e293b;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}

.field-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  background: #fff;
}

.field-input--error { border-color: #ef4444 !important; background: #fff8f8; }
.field-input--valid { border-color: #22c55e; }

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
}

.server-error {
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #be123c;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) { background: #1d4ed8; }
.submit-btn:disabled { cursor: default; opacity: 0.8; }

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
}

.auth-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.auth-link:hover { text-decoration: underline; }

.back-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: center;
}

.back-link:hover { text-decoration: underline; }

.sent-email {
  color: #1e293b;
  font-weight: 700;
}
</style>
