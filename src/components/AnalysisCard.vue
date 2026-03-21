<template>
  <div class="analysis-card p-4 border-round shadow-2 surface-overlay">
    <div class="card-content">
      <div class="main-info">
        <div class="text-xs text-color-secondary">ID: {{ analysis.id }}</div>
        <div class="font-bold text-xl mb-1">{{ analysis.name }}</div>
        <div class="text-sm text-color-secondary mb-2">Код: {{ analysis.code }}</div>
        <p class="description text-sm m-0">{{ analysis.description }}</p>
      </div>
      <div class="actions">
        <div class="price font-bold text-xl mb-2">{{ formatCurrency(analysis.price) }}</div>
        <Button
          :icon="isInCart(analysis.id, 'analysis') ? 'pi pi-check' : 'pi pi-plus'"
          rounded
          :outlined="!isInCart(analysis.id, 'analysis')"
          :severity="isInCart(analysis.id, 'analysis') ? 'success' : undefined"
          aria-label="Добавить в корзину"
          @click="toggleItem(analysis, 'analysis')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import { useCart } from '@/stores/cart';

const { toggleItem, isInCart } = useCart();

const props = defineProps({
  analysis: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return '';
  }
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};
</script>

<style scoped>
.analysis-card {
  width: 100%;
  margin-bottom: 0.75rem;
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.main-info {
  flex-grow: 1;
  margin-right: 1rem;
}
.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
  text-align: right;
}
.description {
  max-width: 600px;
}
</style>
