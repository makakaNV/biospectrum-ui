<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <img src="@/assets/logo-mini.svg" alt="BioSpectrum" class="auth-logo" />
        <h1 class="auth-title">Вход в Биоспектр</h1>
        <p class="auth-subtitle">Войдите в свой аккаунт, чтобы продолжить</p>
      </div>

      <div class="auth-body">
        <div class="field-group">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            :class="{ 'field-input--error': errors.email, 'field-input--valid': email && !errors.email }"
            placeholder="you@example.com"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="field-group">
          <label class="field-label">Пароль</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              :class="{ 'field-input--error': errors.password, 'field-input--valid': password && !errors.password }"
              placeholder="Введите пароль"
              @blur="validatePassword"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <div v-if="serverError" class="server-error">
          <i class="pi pi-exclamation-circle"></i>
          {{ serverError }}
        </div>

        <button
          class="submit-btn"
          :class="{ 'submit-btn--success': loginSuccess, 'submit-btn--loading': loading }"
          @click="login"
          :disabled="loading || loginSuccess"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          <i v-else-if="loginSuccess" class="pi pi-check"></i>
          <span>{{ loginSuccess ? 'Вход выполнен!' : 'Войти' }}</span>
        </button>

        <div class="auth-footer">
          <span>Нет аккаунта?</span>
          <router-link to="/register" class="auth-link">Зарегистрироваться</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/AuthService';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const loginSuccess = ref(false);
const serverError = ref('');

const errors = reactive({ email: '', password: '' });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function validateEmail() {
  if (!email.value) {
    errors.email = 'Введите email';
  } else if (!EMAIL_RE.test(email.value)) {
    errors.email = 'Некорректный формат email';
  } else {
    errors.email = '';
  }
}

function validatePassword() {
  if (!password.value) {
    errors.password = 'Введите пароль';
  } else if (!PASSWORD_RE.test(password.value)) {
    errors.password = 'Мин. 8 символов: строчная, заглавная буква, цифра и спецсимвол';
  } else {
    errors.password = '';
  }
}

function validate() {
  validateEmail();
  validatePassword();
  return !errors.email && !errors.password;
}

const login = async () => {
  serverError.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    const response = await AuthService.login(email.value, password.value);
    const token = response.data?.payload?.token;
    if (token) {
      localStorage.setItem('authToken', token);
    }
    loginSuccess.value = true;
    setTimeout(() => router.push('/'), 700);
  } catch (error) {
    const status = error.response?.status;
    if (status === 500 || status === 401 || status === 400) {
      serverError.value = 'Неверный email или пароль';
    } else {
      serverError.value = 'Произошла ошибка. Попробуйте ещё раз.';
    }
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

.auth-header {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #dbeafe;
}

.auth-logo {
  width: 48px;
  height: 48px;
  margin-bottom: 0.75rem;
}

.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.375rem;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.auth-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.field-input--error {
  border-color: #ef4444 !important;
  background: #fff8f8;
}

.field-input--valid {
  border-color: #22c55e;
}

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .field-input {
  padding-right: 2.75rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  display: flex;
  align-items: center;
}

.password-toggle:hover {
  color: #3b82f6;
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
  transition: background 0.2s, transform 0.1s;
  font-family: inherit;
  margin-top: 0.25rem;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.99);
}

.submit-btn:disabled {
  cursor: default;
}

.submit-btn--success {
  background: #16a34a !important;
}

.submit-btn--loading {
  opacity: 0.8;
}

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  gap: 0.375rem;
  justify-content: center;
}

.auth-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
