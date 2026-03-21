<template>
  <div class="order-card border-round shadow-1 overflow-hidden">
    <div class="flex" style="min-height: 120px;">

      <!-- Левая часть — основная информация -->
      <div class="order-body flex-grow-1 p-4">

        <div class="flex align-items-center justify-content-between mb-2">
          <span class="font-bold text-lg">Заказ #{{ order.id }}</span>
          <span class="text-sm text-color-secondary">{{ formatDate(order.createdAt) }}</span>
        </div>

        <p v-if="order.comment" class="order-comment text-sm text-color-secondary m-0 mb-3">
          {{ order.comment }}
        </p>

        <div class="flex align-items-center gap-3 text-sm text-color-secondary">
          <span><i class="pi pi-list mr-1"></i>Анализов: {{ order.analysesIds?.length ?? 0 }}</span>
          <span><i class="pi pi-user mr-1"></i>Пациент ID: {{ order.patientId }}</span>
        </div>

        <div class="mt-3">
          <Button
            label="Подробнее"
            :icon="detailsOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            iconPos="right"
            text
            size="small"
            @click="detailsOpen = !detailsOpen"
          />
          <div v-if="detailsOpen" class="details-panel mt-2 p-3 border-round surface-ground text-sm text-color-secondary">
            <p class="m-0"><i class="pi pi-info-circle mr-1"></i>Детальная информация будет доступна позже.</p>
          </div>
        </div>

      </div>

      <!-- Правая часть — статус -->
      <div class="right-side flex flex-column" :style="rightSideStyle">

        <!-- Панель статуса -->
        <div class="status-panel flex flex-column align-items-center justify-content-center gap-2 px-3">
          <i :class="statusIcon" style="font-size: 1.6rem;"></i>
          <span class="status-label text-center">{{ statusLabel }}</span>
        </div>

        <!-- Зона результатов (только COMPLETED) -->
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

const router = useRouter();

const props = defineProps({
  order: { type: Object, required: true }
});

const detailsOpen = ref(false);

const STATUS_MAP = {
  REGISTERED: {
    label: 'В обработке',
    icon: 'pi pi-clock',
    bg: '#fff7ed',
    color: '#c2410c',
  },
  APPROVED: {
    label: 'Ожидает сбора',
    icon: 'pi pi-plus-circle',
    bg: '#e0f2fe',
    color: '#0369a1',
  },
  PATCHING: {
    label: 'Обновляется',
    icon: 'pi pi-refresh',
    bg: '#eff6ff',
    color: '#1d4ed8',
  },
  IN_PROGRESS: {
    label: 'В лаборатории',
    icon: 'pi pi-cog',
    bg: '#eef2ff',
    color: '#4338ca',
  },
  COMPLETED: {
    label: 'Выполнен',
    icon: 'pi pi-check-circle',
    bg: '#eff6ff',
    color: '#1d4ed8',
  },
  CANCELED: {
    label: 'Отменён',
    icon: 'pi pi-times-circle',
    bg: '#f3f4f6',
    color: '#6b7280',
  },
};

const statusInfo = computed(() => STATUS_MAP[props.order.status] ?? STATUS_MAP.REGISTERED);
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
  const d = new Date(ts);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
</script>

<style scoped>
.order-card {
  width: 100%;
  background: #f2f4f7;
  border: 1px solid #e2e8ef;
}

.order-comment {
  max-width: 620px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
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

.results-zone:hover {
  background: #1e40af;
}

.results-text {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
  line-height: 1.3;
}

.details-panel {
  border: 1px solid var(--surface-border);
}
</style>
