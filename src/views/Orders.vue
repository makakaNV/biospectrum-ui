<template>
  <div class="orders-page">

    <div class="flex align-items-center gap-3 mb-4">
      <h1 class="m-0">Мои заказы</h1>
    </div>

    <!-- Вкладки по пациентам -->
    <div class="patient-tabs mb-4" v-if="patients.length > 0">
      <button
        class="patient-tab"
        :class="{ active: selectedPatientId === null }"
        @click="selectPatient(null)"
      >
        Все
      </button>
      <button
        v-for="p in patients"
        :key="p.id"
        class="patient-tab"
        :class="{ active: selectedPatientId === p.id }"
        @click="selectPatient(p.id)"
      >
        {{ p.lastName }} {{ p.firstName }}
      </button>
    </div>

    <!-- Загрузка -->
    <div v-if="loading && orders.length === 0" class="flex justify-content-center py-6">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>

    <!-- Пусто -->
    <div v-else-if="!loading && orders.length === 0" class="empty-state border-round shadow-1 p-6 text-center">
      <i class="pi pi-receipt mb-3" style="font-size: 3rem; color: var(--text-color-secondary);"></i>
      <p class="text-color-secondary m-0">
        {{ selectedPatientId ? 'Данный человек еще не проходил исследования' : 'У вас пока нет заказов' }}
      </p>
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
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import Message from 'primevue/message';
import OrderCard from '@/components/OrderCard.vue';
import OrderService from '@/services/OrderService';
import PatientService from '@/services/PatientService';

const router = useRouter();
const route = useRoute();

const orders = ref([]);
const loading = ref(false);
const error = ref('');
const page = ref(0);
const hasMore = ref(false);
const LIMIT = 15;

const patients = ref([]);
const selectedPatientId = ref(null);

const fetchOrders = async (reset = false) => {
  loading.value = true;
  error.value = '';
  try {
    const params = { page: page.value, limit: LIMIT };
    const res = selectedPatientId.value
      ? await OrderService.getOrdersByPatient(selectedPatientId.value, params)
      : await OrderService.getMyOrders(params);

    const data = res.data?.payload;
    const content = data?.content ?? [];
    const pagination = data?.pagination ?? {};

    orders.value = reset ? content : [...orders.value, ...content];
    hasMore.value = page.value < (pagination.pages ?? 1) - 1;
  } catch (e) {
    if (e.response?.status === 401) {
      router.push('/login');
      return;
    }
    if (e.response?.status === 404) {
      orders.value = [];
      hasMore.value = false;
      return;
    }
    error.value = 'Не удалось загрузить заказы. Попробуйте позже.';
  } finally {
    loading.value = false;
  }
};

const selectPatient = (patientId) => {
  if (selectedPatientId.value === patientId) return;
  selectedPatientId.value = patientId;
  page.value = 0;
  fetchOrders(true);
};

const loadMore = () => {
  page.value++;
  fetchOrders(false);
};

const fetchPatients = async () => {
  try {
    const res = await PatientService.getMyPatients({ page: 0, limit: 50 });
    patients.value = res.data?.payload?.content ?? [];
  } catch {
    // не критично — просто не показываем вкладки
  }
};

onMounted(async () => {
  await fetchPatients();
  const queryPatientId = route.query.patientId ? Number(route.query.patientId) : null;
  if (queryPatientId && patients.value.some(p => p.id === queryPatientId)) {
    selectedPatientId.value = queryPatientId;
  }
  fetchOrders(true);
});
</script>

<style scoped>
.orders-page {
  padding: 2rem 0;
  max-width: 860px;
  margin: 0 auto;
}

/* ── Вкладки пациентов ── */
.patient-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.patient-tab {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1.5px solid #e2e8ef;
  background: #f5f7fa;
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  white-space: nowrap;
}

.patient-tab:hover {
  border-color: #3b82f6;
  color: #2563eb;
  background: #eff6ff;
}

.patient-tab.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
}

/* ── Empty state ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}
</style>
