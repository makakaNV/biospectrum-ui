<template>
  <div class="panel-card p-4 border-round shadow-1">

    <!-- Основная информация -->
    <div class="flex justify-content-between align-items-start gap-3">
      <div class="flex-grow-1 min-w-0">
        <div class="text-xs text-color-secondary mb-1">ID: {{ panel.id }}</div>
        <div class="font-bold text-lg mb-1">{{ panel.name }}</div>
        <div class="text-sm text-color-secondary mb-2">Код: {{ panel.code }}</div>
        <p class="text-sm text-color-secondary m-0 description">{{ panel.description }}</p>
      </div>

      <!-- Цена и кнопка -->
      <div class="flex flex-column align-items-end flex-shrink-0">
        <div v-if="panel.discountPercent > 0" class="text-color-secondary text-sm line-through mb-1">
          {{ formatCurrency(panel.price) }}
        </div>
        <div class="font-bold text-xl mb-1" :class="panel.discountPercent > 0 ? 'text-blue-600' : ''">
          {{ formatCurrency(discountedPrice) }}
        </div>
        <div v-if="panel.discountPercent > 0" class="discount-badge mb-2">
          −{{ panel.discountPercent }}%
        </div>
        <Button
          :icon="isInCart(panel.id, 'panel') ? 'pi pi-check' : 'pi pi-plus'"
          rounded
          :outlined="!isInCart(panel.id, 'panel')"
          :severity="isInCart(panel.id, 'panel') ? 'success' : undefined"
          aria-label="Добавить в корзину"
          @click="toggleItem(panel, 'panel')"
        />
      </div>
    </div>

    <!-- Раскрывающийся список анализов -->
    <div v-if="panel.analyses && panel.analyses.length > 0" class="mt-3">
      <button class="analyses-toggle" @click="analysesOpen = !analysesOpen">
        <i :class="analysesOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="mr-2 text-xs"></i>
        <span class="text-sm font-medium">Входящие анализы ({{ panel.analyses.length }})</span>
      </button>

      <div v-if="analysesOpen" class="analyses-list mt-2">
        <div
          v-for="analysis in panel.analyses"
          :key="analysis.id"
          class="analysis-item text-sm flex gap-3 py-2"
        >
          <span class="text-color-secondary w-2rem flex-shrink-0">#{{ analysis.id }}</span>
          <span class="flex-grow-1">{{ analysis.name }}</span>
          <span class="text-color-secondary flex-shrink-0">{{ analysis.code }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import { useCart } from '@/stores/cart';

const { toggleItem, isInCart } = useCart();

const props = defineProps({
  panel: { type: Object, required: true }
});

const analysesOpen = ref(false);

const discountedPrice = computed(() => {
  if (!props.panel.discountPercent) return props.panel.price;
  return props.panel.price * (1 - props.panel.discountPercent / 100);
});

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};
</script>

<style scoped>
.panel-card {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.description {
  max-width: 580px;
}

.discount-badge {
  background: var(--blue-100);
  color: var(--blue-700);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
}

.analyses-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
}

.analyses-toggle:hover {
  opacity: 0.8;
}

.analyses-list {
  border-top: 1px solid var(--surface-border);
}

.analysis-item {
  border-bottom: 1px solid var(--surface-border);
}

.analysis-item:last-child {
  border-bottom: none;
}
</style>
