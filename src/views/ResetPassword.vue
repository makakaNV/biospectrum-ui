<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="reset-header">
        <div class="header-icon-wrap">
          <i class="pi pi-lock"></i>
        </div>
        <h1 class="auth-title">Новый пароль</h1>
        <p class="auth-subtitle">Придумайте новый пароль для вашего аккаунта</p>
      </div>

      <div class="auth-body">

        <!-- Скрытый email для менеджера паролей -->
        <input type="text" autocomplete="username" style="display:none" />

        <div class="field-group">
          <label class="field-label">Новый пароль</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              :class="{ 'field-input--error': errors.password, 'field-input--valid': form.password && !errors.password }"
              placeholder="Минимум 8 символов"
              autocomplete="new-password"
              @blur="validatePassword"
              @input="validateConfirmIfTouched"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          <div v-if="form.password" class="password-hints">
            <span :class="['hint', { 'hint--ok': has8Chars }]"><i class="pi pi-check-circle"></i> 8+ символов</span>
            <span :class="['hint', { 'hint--ok': hasUpper }]"><i class="pi pi-check-circle"></i> Заглавная</span>
            <span :class="['hint', { 'hint--ok': hasLower }]"><i class="pi pi-check-circle"></i> Строчная</span>
            <span :class="['hint', { 'hint--ok': hasDigit }]"><i class="pi pi-check-circle"></i> Цифра</span>
            <span :class="['hint', { 'hint--ok': hasSpecial }]"><i class="pi pi-check-circle"></i> Спецсимвол</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Подтвердите пароль</label>
          <div class="password-wrapper">
            <input
              v-model="form.confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              class="field-input"
              :class="{ 'field-input--error': errors.confirmPassword, 'field-input--valid': form.confirmPassword && !errors.confirmPassword }"
              placeholder="Повторите пароль"
              autocomplete="new-password"
              @blur="validateConfirm"
            />
            <button type="button" class="password-toggle" @click="showConfirm = !showConfirm">
              <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <div v-if="serverError" class="server-error">
          <i class="pi pi-exclamation-circle"></i>
          {{ serverError }}
        </div>

        <button
          class="submit-btn"
          :class="{ 'submit-btn--loading': loading, 'submit-btn--success': success }"
          @click="submit"
          :disabled="loading || success"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          <i v-else-if="success" class="pi pi-check"></i>
          <span>{{ success ? 'Пароль изменён!' : 'Сменить пароль' }}</span>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthService from '@/services/AuthService';

const route = useRoute();
const router = useRouter();

const resetToken = route.query.token ?? '';

const showPassword = ref(false);
const showConfirm = ref(false);
const loading = ref(false);
const success = ref(false);
const serverError = ref('');
const confirmTouched = ref(false);

const form = reactive({ password: '', confirmPassword: '' });
const errors = reactive({ password: '', confirmPassword: '' });

const has8Chars = computed(() => form.password.length >= 8);
const hasUpper  = computed(() => /[A-Z]/.test(form.password));
const hasLower  = computed(() => /[a-z]/.test(form.password));
const hasDigit  = computed(() => /\d/.test(form.password));
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password));
const passwordValid = computed(() => has8Chars.value && hasUpper.value && hasLower.value && hasDigit.value && hasSpecial.value);

function validatePassword() {
  if (!form.password) {
    errors.password = 'Введите пароль';
  } else if (!passwordValid.value) {
    errors.password = 'Пароль не соответствует требованиям';
  } else {
    errors.password = '';
  }
}

function validateConfirm() {
  confirmTouched.value = true;
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  } else {
    errors.confirmPassword = '';
  }
}

function validateConfirmIfTouched() {
  if (confirmTouched.value) validateConfirm();
}

function validate() {
  validatePassword();
  validateConfirm();
  return !errors.password && !errors.confirmPassword;
}

const submit = async () => {
  serverError.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    await AuthService.confirmPasswordReset({
      resetToken,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
    success.value = true;
    setTimeout(() => router.push('/login'), 900);
  } catch (error) {
    const status = error.response?.status;
    if (status === 400) {
      serverError.value = 'Ссылка недействительна или уже была использована.';
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

.reset-header {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #dbeafe;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.header-icon-wrap {
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
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

.password-toggle:hover { color: #3b82f6; }

.password-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.hint {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.15s;
}

.hint--ok { color: #16a34a; }

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

.submit-btn:hover:not(:disabled) { background: #1d4ed8; }
.submit-btn:active:not(:disabled) { transform: scale(0.99); }
.submit-btn:disabled { cursor: default; }
.submit-btn--success { background: #16a34a !important; }
.submit-btn--loading { opacity: 0.8; }
</style>
