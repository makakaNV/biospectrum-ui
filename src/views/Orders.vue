<template>
  <div class="orders-page">

    <div class="flex align-items-center gap-3 mb-4">
      <h1 class="m-0">Мои заказы</h1>
    </div>

    <!-- Загрузка -->
    <div v-if="loading && orders.length === 0" class="flex justify-content-center py-6">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>

    <!-- Пусто -->
    <div v-else-if="!loading && orders.length === 0" class="empty-state border-round shadow-1 p-6 text-center">
      <i class="pi pi-receipt mb-3" style="font-size: 3rem; color: var(--text-color-secondary);"></i>
      <p class="text-color-secondary m-0">У вас пока нет заказов</p>
    </div>

    <!-- Список -->
    <div v-else class="flex flex-column gap-3">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>

    <!-- Показать ещё -->
    <div v-if="hasMore" class="flex justify-content-center mt-4">
      <Button
        label="Показать ещё"
        icon="pi pi-chevron-down"
        iconPos="right"
        outlined
        :loading="loading"
        @click="loadMore"
      />
    </div>

    <!-- Ошибка -->
    <Message v-if="error" severity="error" :closable="false" class="mt-3">{{ error }}</Message>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Message from 'primevue/message';
import OrderCard from '@/components/OrderCard.vue';
import OrderService from '@/services/OrderService';

const router = useRouter();

const orders = ref([]);
const loading = ref(false);
const error = ref('');
const page = ref(0);
const hasMore = ref(false);
const LIMIT = 15;

const fetchOrders = async (reset = false) => {
  loading.value = true;
  error.value = '';
  try {
    const res = await OrderService.getMyOrders({ page: page.value, limit: LIMIT });
    const data = res.data?.payload;
    const content = data?.content ?? [];
    const pagination = data?.pagination ?? {};

    if (reset) {
      orders.value = content;
    } else {
      orders.value.push(...content);
    }

    hasMore.value = page.value < (pagination.pages ?? 1) - 1;
  } catch (e) {
    if (e.response?.status === 401) {
      router.push('/login');
      return;
    }
    error.value = 'Не удалось загрузить заказы. Попробуйте позже.';
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  page.value++;
  fetchOrders(false);
};

onMounted(() => fetchOrders(true));
</script>

<style scoped>
.orders-page {
  padding: 2rem 0;
  max-width: 860px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}
</style>
