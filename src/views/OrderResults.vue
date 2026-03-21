<template>
  <div class="results-page">

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-content-center py-8">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>

    <template v-else>

      <!-- Шапка -->
      <div class="results-header border-round shadow-1 p-4 mb-4">
        <div class="flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <div class="flex align-items-center gap-2 mb-1">
              <Button icon="pi pi-arrow-left" text size="small" @click="$router.back()" />
              <h1 class="m-0 text-2xl font-bold">Результаты заказа #{{ orderId }}</h1>
            </div>
            <div class="flex align-items-center gap-4 mt-2 text-color-secondary text-sm">
              <span v-if="patient">
                <i class="pi pi-user mr-1"></i>
                {{ patientFullName }}
              </span>
              <span v-if="completedDate">
                <i class="pi pi-calendar mr-1"></i>
                Выполнен {{ completedDate }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ошибка -->
      <Message v-if="error" severity="error" :closable="false" class="mb-3">{{ error }}</Message>

      <!-- Пусто -->
      <div v-if="!error && results.length === 0" class="empty-results border-round shadow-1 p-6 text-center">
        <i class="pi pi-inbox mb-3" style="font-size: 2.5rem; color: var(--text-color-secondary);"></i>
        <p class="text-color-secondary m-0">Результаты пока не готовы</p>
      </div>

      <!-- Список результатов -->
      <div v-else class="flex flex-column gap-3">
        <div
          v-for="(item, index) in results"
          :key="item.id"
          class="result-card border-round shadow-1 overflow-hidden"
        >
          <div class="flex">

            <!-- Номер -->
            <div class="result-number flex align-items-center justify-content-center" :class="numberClass(item.status)">
              <span class="font-bold text-lg">{{ index + 1 }}</span>
            </div>

            <!-- Содержимое -->
            <div class="result-body flex-grow-1 p-4">
              <div class="flex align-items-start justify-content-between gap-3 flex-wrap">
                <div>
                  <div class="font-bold text-base">{{ item.analysisName }}</div>
                </div>
                <!-- Результат -->
                <div class="result-value-block text-right">
                  <div v-if="item.result" class="result-value">{{ item.result }}</div>
                  <div v-else class="text-color-secondary text-sm">—</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Message from 'primevue/message';
import OrderService from '@/services/OrderService';
import PatientService from '@/services/PatientService';

const route = useRoute();
const router = useRouter();

const orderId = route.params.id;
const patientId = route.query.patientId;

const loading = ref(true);
const error = ref('');
const results = ref([]);
const patient = ref(null);

const patientFullName = computed(() => {
  if (!patient.value) return '';
  const p = patient.value;
  return [p.lastName, p.firstName, p.middleName].filter(Boolean).join(' ');
});

const completedDate = computed(() => {
  const done = results.value.find(r => r.completedAt);
  return done ? formatDate(done.completedAt) : null;
});

const formatDate = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const STATUS_LABEL = {
  PENDING:     'Ожидает',
  IN_PROGRESS: 'В процессе',
  COMPLETED:   'Готов',
  CANCELLED:   'Отменён',
};
const statusLabel = (s) => STATUS_LABEL[s] ?? s;

const statusBadgeClass = (s) => ({
  'badge-pending':     s === 'PENDING',
  'badge-in-progress': s === 'IN_PROGRESS',
  'badge-completed':   s === 'COMPLETED',
  'badge-cancelled':   s === 'CANCELLED',
});

const numberClass = (s) => ({
  'number-completed':   s === 'COMPLETED',
  'number-in-progress': s === 'IN_PROGRESS',
  'number-pending':     s === 'PENDING',
  'number-cancelled':   s === 'CANCELLED',
});

onMounted(async () => {
  try {
    const [resultsRes, patientRes] = await Promise.all([
      OrderService.getTestResults(orderId),
      patientId ? PatientService.getPatientById(patientId) : Promise.resolve(null),
    ]);

    results.value = resultsRes.data?.payload ?? [];
    patient.value = patientRes?.data?.payload ?? null;
  } catch (e) {
    error.value = 'Не удалось загрузить результаты.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.results-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 0;
}

.results-header,
.result-card,
.empty-results {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.completed-badge {
  display: inline-flex;
  align-items: center;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  padding: 0.35rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

/* Номер */
.result-number {
  width: 52px;
  flex-shrink: 0;
  font-size: 1rem;
}
.number-completed   { background: #eff6ff; color: #1d4ed8; }
.number-in-progress { background: #eef2ff; color: #4338ca; }
.number-pending     { background: #fff7ed; color: #c2410c; }
.number-cancelled   { background: #f3f4f6; color: #6b7280; }

/* Статус-бейдж */
.result-status-badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.badge-completed   { background: #dbeafe; color: #1e40af; }
.badge-in-progress { background: #e0e7ff; color: #4338ca; }
.badge-pending     { background: #ffedd5; color: #c2410c; }
.badge-cancelled   { background: #f3f4f6; color: #6b7280; }

/* Значение результата */
.result-value-block {
  min-width: 100px;
}
.result-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
}
</style>
