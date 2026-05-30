<template>
  <div class="order-card border-round shadow-1 overflow-hidden">
    <div class="flex" style="min-height: 120px;">

      <!-- Левая часть — основная информация -->
      <div class="order-body flex-grow-1 p-4">

        <div class="flex align-items-center justify-content-between mb-2">
          <span class="font-bold text-lg">Заказ #{{ order.id }}</span>
          <span class="text-sm text-color-secondary">{{ formatDate(order.createdAt) }}</span>
        </div>

        <div class="flex align-items-start justify-content-between gap-3 mb-3">
          <p v-if="order.comment" class="order-comment text-sm text-color-secondary m-0 flex-grow-1">
            {{ order.comment }}
          </p>
          <span v-if="order.totalSum != null" class="total-sum">
            {{ formatCurrency(order.totalSum) }}
          </span>
        </div>

        <div class="flex align-items-center gap-3 text-sm text-color-secondary">
          <span><i class="pi pi-heart mr-1"></i>Анализов: {{ order.analysesIds?.length ?? 0 }}</span>
          <span v-if="order.panelsIds?.length"><i class="pi pi-wave-pulse mr-1"></i>Исследований: {{ order.panelsIds.length }}</span>
          <span><i class="pi pi-user mr-1"></i>Пациент ID: {{ order.patientId }}</span>
        </div>

        <!-- Открывашка -->
        <div class="mt-3">
          <Button
            label="Подробнее"
            :icon="detailsOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            iconPos="right"
            text
            size="small"
            @click="toggleDetails"
          />

          <div v-if="detailsOpen" class="details-panel mt-2">

            <div v-if="detailsLoading" class="flex align-items-center gap-2 p-3 text-color-secondary text-sm">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Загружаем данные...</span>
            </div>

            <div v-else-if="detailsError" class="details-error p-3 text-sm">
              <i class="pi pi-exclamation-circle mr-2"></i>{{ detailsError }}
            </div>

            <div v-else class="details-content">

              <!-- Пациент -->
              <div class="detail-section">
                <div class="detail-section-title">Исследование для:</div>
                <div v-if="patient" class="patient-detail">
                  <div class="patient-detail-name">
                    {{ [patient.lastName, patient.firstName, patient.middleName].filter(Boolean).join(' ') }}<span v-if="patient.snils" class="patient-snils"> — {{ patient.snils }}</span>
                  </div>
                  <div class="patient-detail-rows">
                    <div v-if="patient.birthDate" class="patient-detail-row">
                      <span>{{ formatDate(patient.birthDate) }}</span>
                    </div>
                    <div v-if="patient.phoneNumber" class="patient-detail-row">
                      <span>{{ patient.phoneNumber }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Исследования (panels) -->
              <div class="detail-section" v-if="panels.length">
                <div class="detail-section-title">Исследования</div>
                <div class="panels-list">
                  <div v-for="panel in panels" :key="panel.id" class="panel-item">
                    <div class="panel-header">
                      <span class="panel-name">{{ panel.name }}</span>
                      <span class="panel-code-chip">{{ panel.code }}</span>
                    </div>
                    <div class="panel-analyses" v-if="panel.analyses?.length">
                      <div
                        v-for="a in panel.analyses"
                        :key="a.id"
                        class="analysis-item analysis-item--nested"
                      >
                        <div class="analysis-item-main">
                          <span class="analysis-item-name">{{ a.name }}</span>
                          <span class="analysis-item-code">{{ a.code }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Отдельные анализы -->
              <div class="detail-section" v-if="standaloneAnalyses.length">
                <div class="detail-section-title">{{ panels.length ? 'Отдельные анализы' : 'Анализы в заказе' }}</div>
                <div class="analyses-list">
                  <div
                    v-for="a in standaloneAnalyses"
                    :key="a.id"
                    class="analysis-item"
                  >
                    <div class="analysis-item-main">
                      <span class="analysis-item-name">{{ a.name }}</span>
                      <span class="analysis-item-code">{{ a.code }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Правая часть — статус -->
      <div class="right-side flex flex-column" :style="rightSideStyle">

        <div class="status-panel flex flex-column align-items-center justify-content-center gap-2 px-3">
          <i :class="statusIcon" style="font-size: 1.6rem;"></i>
          <span class="status-label text-center">{{ statusLabel }}</span>
        </div>

        <div v-if="isCompleted" class="results-zone flex align-items-center justify-content-center" @click="goToResults">
          <span class="results-text">Посмотреть результаты</span>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import PatientService from '@/services/PatientService';
import AnalysisService from '@/services/AnalysisService';
import PanelService from '@/services/PanelService';

const router = useRouter();

const props = defineProps({
  order: { type: Object, required: true }
});

const detailsOpen    = ref(false);
const detailsLoading = ref(false);
const detailsError   = ref('');
const detailsLoaded  = ref(false);
const patient        = ref(null);
const panels         = ref([]);
const standaloneAnalyses = ref([]);

const toggleDetails = async () => {
  detailsOpen.value = !detailsOpen.value;
  if (!detailsOpen.value || detailsLoaded.value) return;

  detailsLoading.value = true;
  detailsError.value = '';
  try {
    const [patientRes, analysesRes] = await Promise.all([
      PatientService.getPatientById(props.order.patientId),
      AnalysisService.getAnalysesByIds(props.order.analysesIds ?? []),
    ]);

    patient.value = patientRes.data?.payload ?? null;
    const allAnalyses = analysesRes.data?.payload ?? [];

    if (props.order.panelsIds?.length) {
      const panelsRes = await PanelService.getPanelsByIds(props.order.panelsIds);
      panels.value = panelsRes.data?.payload ?? [];
    }

    const panelAnalysisIds = new Set(
      panels.value.flatMap(p => (p.analyses ?? []).map(a => a.id))
    );
    standaloneAnalyses.value = allAnalyses.filter(a => !panelAnalysisIds.has(a.id));

    detailsLoaded.value = true;
  } catch {
    detailsError.value = 'Не удалось загрузить детали заказа.';
  } finally {
    detailsLoading.value = false;
  }
};

const STATUS_MAP = {
  REGISTERED: { label: 'В обработке',    icon: 'pi pi-clock',        bg: '#fff7ed', color: '#c2410c' },
  APPROVED:   { label: 'Ожидает сбора',  icon: 'pi pi-plus-circle',  bg: '#e0f2fe', color: '#0369a1' },
  PATCHING:   { label: 'Обновляется',    icon: 'pi pi-refresh',      bg: '#eff6ff', color: '#1d4ed8' },
  IN_PROGRESS:{ label: 'В лаборатории',  icon: 'pi pi-cog',          bg: '#eef2ff', color: '#4338ca' },
  COMPLETED:  { label: 'Выполнен',       icon: 'pi pi-check-circle', bg: '#eff6ff', color: '#1d4ed8' },
  CANCELED:   { label: 'Отменён',        icon: 'pi pi-times-circle', bg: '#f3f4f6', color: '#6b7280' },
};

const statusInfo  = computed(() => STATUS_MAP[props.order.status] ?? STATUS_MAP.REGISTERED);
const statusLabel = computed(() => statusInfo.value.label);
const statusIcon  = computed(() => statusInfo.value.icon);
const isCompleted = computed(() => props.order.status === 'COMPLETED');

const rightSideStyle = computed(() => ({
  width: '170px',
  flexShrink: '0',
  borderLeft: `3px solid ${statusInfo.value.color}`,
}));

const goToResults = () => {
  router.push({ name: 'OrderResults', params: { id: props.order.id }, query: { patientId: props.order.patientId } });
};

const formatDate = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (v) => {
  if (typeof v !== 'number') return '';
  return v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
};
</script>

<style scoped>
.order-card {
  width: 100%;
  background: #f2f4f7;
  border: 1px solid #e2e8ef;
}

.order-comment {
  max-width: 520px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.total-sum {
  font-size: 1rem;
  font-weight: 700;
  color: #475569;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.status-panel {
  flex: 1;
  background: v-bind('statusInfo.bg');
  color: v-bind('statusInfo.color');
}

.results-zone {
  background: #1d4ed8;
  color: #ffffff;
  padding: 0.65rem 0.5rem;
  cursor: pointer;
  transition: background 0.15s;
}
.results-zone:hover { background: #1e40af; }

.results-text {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
  line-height: 1.3;
}

/* ── Details panel ── */
.details-panel {
  border: 1px solid #dde4ee;
  border-radius: 10px;
  overflow: hidden;
}

.details-error {
  color: #dc2626;
  background: #fef2f2;
}

.details-content {
  display: flex;
  flex-direction: column;
}

/* ── Section ── */
.detail-section {
  padding: 1rem 1rem 0.875rem;
}
.detail-section + .detail-section {
  border-top: 1px solid #e8edf5;
}

.detail-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

/* ── Patient ── */
.patient-detail-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.45;
}

.patient-snils {
  font-weight: 500;
  color: #64748b;
}

.patient-detail-rows {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1.25rem;
}

.patient-detail-row {
  font-size: 0.8125rem;
  color: #64748b;
}

/* ── Panels ── */
.panels-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.panel-item {
  background: #ffffff;
  border: 1px solid #dde4ee;
  border-radius: 10px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
}

.panel-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e3a8a;
}

.panel-code-chip {
  font-size: 0.7rem;
  font-weight: 700;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 5px;
  padding: 0.15rem 0.45rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.panel-analyses {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.375rem 0;
}

/* ── Analyses list ── */
.analyses-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.analysis-item {
  background: #ffffff;
  border: 1px solid #e8edf5;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.analysis-item--nested {
  border: none;
  border-radius: 0;
  background: transparent;
  border-bottom: 1px solid #f0f4f8;
  padding: 0.4rem 0.875rem;
}
.analysis-item--nested:last-child {
  border-bottom: none;
}

.analysis-item-main {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.analysis-item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
  min-width: 0;
}

.analysis-item--nested .analysis-item-name {
  font-weight: 500;
  color: #334155;
}

.analysis-item-code {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  font-family: monospace;
  flex-shrink: 0;
}

.analysis-item-price {
  font-size: 0.775rem;
  color: #94a3b8;
  margin-top: 0.1rem;
}
</style>
