<template>
  <div class="cart-item-card p-3 border-round shadow-1">
    <div class="flex align-items-start gap-3">

      <!-- Инфо -->
      <div class="flex-grow-1 min-w-0">
        <div class="text-xs text-color-secondary">ID: {{ item.id }} · {{ item.code }}</div>
        <div class="font-semibold text-base">{{ item.name }}</div>

        <!-- Цена -->
        <div class="flex align-items-center gap-2 mt-1">
          <span v-if="item.type === 'panel' && item.discountPercent > 0" class="text-color-secondary text-sm line-through">
            {{ formatCurrency(item.price) }}
          </span>
          <span class="font-bold" :class="item.type === 'panel' && item.discountPercent > 0 ? 'text-blue-600' : ''">
            {{ formatCurrency(itemPrice(item)) }}
          </span>
          <span v-if="item.type === 'panel' && item.discountPercent > 0" class="discount-badge">
            −{{ item.discountPercent }}%
          </span>
        </div>
      </div>

      <!-- Удалить -->
      <Button icon="pi pi-times" text rounded severity="secondary" size="small" @click="emit('remove', item)" />
    </div>

    <!-- Анализы панели -->
    <div v-if="item.type === 'panel' && item.analyses && item.analyses.length > 0" class="mt-2">
      <button class="analyses-toggle text-sm" @click="open = !open">
        <i :class="open ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="mr-1 text-xs"></i>
        Анализы ({{ item.analyses.length }})
      </button>
      <div v-if="open" class="analyses-list mt-1">
        <div v-for="a in item.analyses" :key="a.id" class="analysis-row text-sm flex gap-3 py-1">
          <span class="text-color-secondary flex-shrink-0">#{{ a.id }}</span>
          <span class="flex-grow-1">{{ a.name }}</span>
          <span class="text-color-secondary flex-shrink-0">{{ a.code }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import { useCart } from '@/stores/cart';

const { itemPrice } = useCart();
const open = ref(false);

defineProps({ item: { type: Object, required: true } });
const emit = defineEmits(['remove']);

const formatCurrency = (v) => {
  if (typeof v !== 'number') return '';
  return v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};
</script>

<style scoped>
.cart-item-card {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.discount-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 1rem;
  background: var(--blue-100);
  color: var(--blue-700);
}

.analyses-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  padding: 0;
  display: flex;
  align-items: center;
}
.analyses-list { border-top: 1px solid var(--surface-border); }
.analysis-row  { border-bottom: 1px solid var(--surface-border); }
.analysis-row:last-child { border-bottom: none; }
</style>
