<template>
  <div class="search-page flex justify-content-center align-items-start pt-8">
    <div class="search-card surface-card border-round shadow-2 p-5">

      <div class="text-center mb-5">
        <i class="pi pi-search mb-3" style="font-size: 2.5rem; color: var(--primary-color);"></i>
        <h1 class="m-0 mb-1 text-2xl font-bold">Результаты анализов</h1>
        <p class="text-color-secondary m-0 text-sm">Введите номер заказа для просмотра результатов</p>
      </div>

      <div class="flex gap-2">
        <InputNumber
          v-model="orderId"
          placeholder="Номер заказа"
          :useGrouping="false"
          class="flex-grow-1"
          @keydown.enter="search"
          :disabled="loading"
          autofocus
        />
        <Button
          label="Найти"
          icon="pi pi-search"
          :loading="loading"
          @click="search"
        />
      </div>

      <Message v-if="error" severity="error" :closable="false" class="mt-3">{{ error }}</Message>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Message from 'primevue/message';
import OrderService from '@/services/OrderService';

const router = useRouter();
const orderId = ref(null);
const loading = ref(false);
const error = ref('');

const search = async () => {
  error.value = '';

  if (!orderId.value) {
    error.value = 'Введите номер заказа.';
    return;
  }

  loading.value = true;
  try {
    // Загружаем все заказы пользователя для проверки владения
    const res = await OrderService.getMyOrders({ page: 0, limit: 1000 });
    const orders = res.data?.payload?.content ?? [];
    const found = orders.find(o => o.id === orderId.value);

    if (!found) {
      error.value = 'Заказ не найден.';
      return;
    }

    router.push({
      name: 'OrderResults',
      params: { id: found.id },
      query: { patientId: found.patientId }
    });
  } catch (e) {
    error.value = 'Не удалось выполнить поиск. Попробуйте позже.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 80px);
}

.search-card {
  width: 100%;
  max-width: 460px;
}
</style>
