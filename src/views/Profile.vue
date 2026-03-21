<template>
  <div class="profile-page">

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-content-center pt-8">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>

    <template v-else-if="user">

      <!-- Аватар + имя -->
      <div class="profile-hero surface-card border-round shadow-1 p-5 mb-4 flex align-items-center gap-4">
        <div class="avatar flex align-items-center justify-content-center">
          <i class="pi pi-user" style="font-size: 2rem; color: #fff;"></i>
        </div>
        <div>
          <div class="text-2xl font-bold mb-1">{{ user.username }}</div>
          <div class="text-color-secondary text-sm">{{ user.email }}</div>
        </div>
      </div>

      <!-- Детали аккаунта -->
      <div class="surface-card border-round shadow-1 p-4 mb-4">
        <div class="text-xs font-bold text-color-secondary uppercase mb-3" style="letter-spacing: 0.06em;">Данные аккаунта</div>
        <div class="flex flex-column gap-3">
          <div class="info-row">
            <span class="info-label"><i class="pi pi-user mr-2"></i>Имя пользователя</span>
            <span class="info-value">{{ user.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="pi pi-envelope mr-2"></i>Email</span>
            <span class="info-value">{{ user.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="pi pi-calendar mr-2"></i>Дата регистрации</span>
            <span class="info-value">{{ formatDate(user.created) }}</span>
          </div>
        </div>
      </div>

      <!-- Быстрые переходы -->
      <div class="text-xs font-bold text-color-secondary uppercase mb-3" style="letter-spacing: 0.06em;">Быстрый доступ</div>
      <div class="flex gap-3 flex-wrap">
        <div class="quick-link surface-card border-round shadow-1 p-4 flex-1 flex align-items-center gap-3 cursor-pointer" @click="router.push('/orders')">
          <div class="quick-icon" style="background: #eff6ff; color: #1d4ed8;">
            <i class="pi pi-receipt" style="font-size: 1.4rem;"></i>
          </div>
          <div>
            <div class="font-bold mb-1">Мои заказы</div>
            <div class="text-sm text-color-secondary">История и статусы заказов</div>
          </div>
          <i class="pi pi-chevron-right ml-auto text-color-secondary"></i>
        </div>

        <div class="quick-link surface-card border-round shadow-1 p-4 flex-1 flex align-items-center gap-3 cursor-pointer" @click="router.push('/patients')">
          <div class="quick-icon" style="background: #f0fdf4; color: #15803d;">
            <i class="pi pi-users" style="font-size: 1.4rem;"></i>
          </div>
          <div>
            <div class="font-bold mb-1">Мои пациенты</div>
            <div class="text-sm text-color-secondary">Управление пациентами</div>
          </div>
          <i class="pi pi-chevron-right ml-auto text-color-secondary"></i>
        </div>
      </div>

    </template>

    <Message v-if="error" severity="error" :closable="false" class="mt-3">{{ error }}</Message>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Message from 'primevue/message';
import UserService from '@/services/UserService';

const router = useRouter();
const user = ref(null);
const loading = ref(true);
const error = ref('');

const formatDate = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
};

onMounted(async () => {
  try {
    const res = await UserService.getMe();
    user.value = res.data?.payload ?? null;
  } catch (e) {
    error.value = 'Не удалось загрузить профиль.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 0;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #15803d);
  flex-shrink: 0;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}
.info-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.quick-link {
  min-width: 240px;
  transition: box-shadow 0.15s, transform 0.15s;
}
.quick-link:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
