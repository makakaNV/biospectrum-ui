<template>
  <div class="results-page">

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-content-center py-8">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>

    <template v-else>

      <!-- Шапка -->
      <div class="results-header border-round shadow-1 p-4 mb-4">
        <div class="header-layout">
          <Button icon="pi pi-arrow-left" text size="small" @click="$router.back()" class="header-back" />
          <div class="header-center">
            <h1 class="m-0 font-bold" style="font-size: 1.5rem;">Результаты заказа #{{ orderId }}</h1>
            <div class="flex align-items-center justify-content-center gap-4 mt-2 text-color-secondary text-sm flex-wrap">
              <span v-if="patientError" class="patient-not-found">
                <i class="pi pi-user mr-1"></i>— — —
                <span class="patient-not-found-label ml-1">Пациент не найден</span>
              </span>
              <span v-else-if="patient">
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

      <!-- Результаты недоступны -->
      <div v-if="resultsError" class="results-unavailable border-round shadow-1 p-6 text-center mb-3">
        <i class="pi pi-exclamation-triangle mb-3" style="font-size: 2.5rem; color: #b45309;"></i>
        <p class="m-0" style="color: #b45309; font-weight: 600;">Результаты недоступны</p>
        <p class="text-color-secondary text-sm mt-1 m-0">Не удалось получить данные с сервера. Попробуйте позже.</p>
      </div>

      <!-- Пусто -->
      <div v-else-if="results.length === 0" class="empty-results border-round shadow-1 p-6 text-center">
        <i class="pi pi-inbox mb-3" style="font-size: 2.5rem; color: var(--text-color-secondary);"></i>
        <p class="text-color-secondary m-0">Результаты пока не готовы</p>
      </div>

      <!-- Список результатов -->
      <div v-else class="flex flex-column gap-3 align-items-center">
        <div
          v-for="(item, index) in results"
          :key="item.id"
          class="result-card border-round shadow-1 overflow-hidden"
        >
          <div class="flex">

            <!-- Левая цветная панель -->
            <div
              class="result-sidebar flex flex-column align-items-center justify-content-center gap-2"
              :style="sidebarStyle(item)"
            >
              <span class="sidebar-number">{{ index + 1 }}</span>
              <i :class="sidebarIcon(item)" class="sidebar-icon"></i>
            </div>

            <!-- Содержимое -->
            <div class="result-body flex-grow-1 p-4">

              <!-- Название + код -->
              <div class="flex align-items-center gap-2 mb-3 flex-wrap">
                <div class="analysis-name">{{ item.analysisName }}</div>
                <span v-if="item.analysisCode" class="analysis-code-chip">{{ item.analysisCode }}</span>
              </div>

              <!-- Данные -->
              <div class="result-data-grid">

                <div class="data-cell">
                  <span class="data-label">Результат</span>
                  <span class="data-value result-value-text">
                    {{ item.result ?? '—' }}
                    <span v-if="item.result && item.refUnit" class="result-unit">{{ item.refUnit }}</span>
                  </span>
                </div>

                <div class="data-cell">
                  <span class="data-label">Референсные значения</span>
                  <span class="data-value">
                    <template v-if="item.refMin != null || item.refMax != null">
                      {{ item.refMin ?? '?' }} – {{ item.refMax ?? '?' }}
                      <span v-if="item.refUnit" class="result-unit">{{ item.refUnit }}</span>
                    </template>
                    <template v-else>—</template>
                  </span>
                </div>

                <div class="data-cell data-cell--center" v-if="item.resultInterpretation">
                  <span class="data-label">Интерпретация</span>
                  <span
                    class="interp-badge"
                    :style="interpBadgeStyle(item.resultInterpretation)"
                  >
                    {{ interpLabel(item.resultInterpretation) }}
                  </span>
                </div>

                <div class="data-cell" v-else-if="item.status">
                  <span class="data-label">Статус</span>
                  <span class="status-text" :style="statusStyle(item.status)">{{ statusLabel(item.status) }}</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- Нижняя карточка с дисклеймером -->
        <div class="footer-card results-header border-round shadow-1 mt-1" style="padding: 0.6rem 1rem;">
          <p class="footer-line m-0 text-center">
            * Результаты исследования не являются диагнозом, необходима консультация специалиста.
          </p>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import OrderService from '@/services/OrderService';
import PatientService from '@/services/PatientService';

const route = useRoute();

const orderId = route.params.id;
const patientId = route.query.patientId;

const loading = ref(true);
const patientError  = ref(false);
const resultsError  = ref(false);
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

// ── Интерпретация ──

const INTERP_CONFIG = {
  NORMAL:             { bg: '#f0fdf4', color: '#16a34a', icon: 'pi pi-check',      label: 'Норма' },
  SLIGHTLY_LOW:       { bg: '#fffbeb', color: '#d97706', icon: 'pi pi-arrow-down', label: 'Немного ниже нормы' },
  SLIGHTLY_HIGH:      { bg: '#fffbeb', color: '#d97706', icon: 'pi pi-arrow-up',   label: 'Немного выше нормы' },
  SIGNIFICANTLY_LOW:  { bg: '#fef9c3', color: '#a16207', icon: 'pi pi-arrow-down', label: 'Значительно ниже нормы' },
  SIGNIFICANTLY_HIGH: { bg: '#fef9c3', color: '#a16207', icon: 'pi pi-arrow-up',   label: 'Значительно выше нормы' },
  CRITICALLY_LOW:     { bg: '#fee2e2', color: '#dc2626', icon: 'pi pi-arrow-down', label: 'Критически низкий' },
  CRITICALLY_HIGH:    { bg: '#fee2e2', color: '#dc2626', icon: 'pi pi-arrow-up',   label: 'Критически высокий' },
};

const STATUS_CONFIG = {
  PENDING:     { bg: '#fff7ed', color: '#c2410c', icon: 'pi pi-clock',        label: 'Ожидает' },
  READY:       { bg: '#eff6ff', color: '#1d4ed8', icon: 'pi pi-check-circle', label: 'Готов' },
  IN_PROGRESS: { bg: '#eef2ff', color: '#4338ca', icon: 'pi pi-spinner',      label: 'В процессе' },
  COMPLETED:   { bg: '#eff6ff', color: '#1d4ed8', icon: 'pi pi-check-circle', label: 'Выполнен' },
  CANCELLED:   { bg: '#f3f4f6', color: '#6b7280', icon: 'pi pi-times',        label: 'Отменён' },
};

const getConfig = (item) => {
  if (item.resultInterpretation && INTERP_CONFIG[item.resultInterpretation]) {
    return INTERP_CONFIG[item.resultInterpretation];
  }
  return STATUS_CONFIG[item.status] ?? { bg: '#f5f7fa', color: '#64748b', icon: 'pi pi-minus', label: '—' };
};

const sidebarStyle = (item) => {
  const { bg, color } = getConfig(item);
  return { background: bg, color };
};

const sidebarIcon = (item) => getConfig(item).icon;

const interpLabel = (code) => INTERP_CONFIG[code]?.label ?? code;

const interpBadgeStyle = (code) => {
  const cfg = INTERP_CONFIG[code];
  if (!cfg) return {};
  return {
    background: cfg.bg,
    color: cfg.color,
    border: `1px solid ${cfg.color}33`,
  };
};

const statusLabel = (s) => STATUS_CONFIG[s]?.label ?? s;
const statusStyle = (s) => {
  const cfg = STATUS_CONFIG[s];
  return cfg ? { color: cfg.color } : {};
};

onMounted(async () => {
  const [resultsResult, patientResult] = await Promise.allSettled([
    OrderService.getTestResults(orderId),
    patientId ? PatientService.getPatientById(patientId) : Promise.resolve(null),
  ]);

  resultsError.value = resultsResult.status === 'rejected';
  patientError.value = patientResult.status === 'rejected';

  results.value = resultsError.value  ? [] : (resultsResult.value?.data?.payload ?? []);
  patient.value = patientError.value  ? null : (patientResult.value?.data?.payload ?? null);

  loading.value = false;
});
</script>

<style scoped>
.results-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 0;
}

.results-header,
.empty-results,
.results-unavailable {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.results-unavailable {
  border-color: #fde68a;
  background: #fffbeb;
}

.patient-not-found {
  color: #b45309;
}

.patient-not-found-label {
  font-size: 0.75rem;
  font-style: italic;
}

.result-card {
  width: 700px;
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.results-header {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.header-layout {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-center {
  text-align: center;
}

.header-back {
  position: absolute;
  left: 0;
}

.footer-card {
  max-width: none;
  white-space: nowrap;
  width: fit-content;
}

.footer-line {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  font-style: italic;
}

/* Левая панель */
.result-sidebar {
  width: 64px;
  flex-shrink: 0;
  padding: 1rem 0;
  transition: background 0.2s;
}

.sidebar-number {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1;
}

.sidebar-icon {
  font-size: 1rem;
}

/* Название + код */
.analysis-name {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
  color: #0f172a;
}

.analysis-code-chip {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  background: #e2e8f0;
  color: #475569;
  border-radius: 6px;
  padding: 0.22rem 0.6rem;
  white-space: nowrap;
  margin-top: 3px;
}

/* Сетка данных */
.result-data-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
}

.data-cell {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 110px;
}

.data-cell--center {
  align-items: center;
}

.data-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}

.data-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.result-value-text {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.result-unit {
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin-left: 0.3rem;
}

/* Бейдж интерпретации */
.interp-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  white-space: nowrap;
  line-height: 1;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
