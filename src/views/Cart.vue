<template>
  <div class="cart-page">

    <div v-if="items.length === 0" class="text-center mt-6">
      <i class="pi pi-shopping-cart text-5xl text-color-secondary mb-3" style="display:block"></i>
      <p class="text-color-secondary text-lg">Корзина пуста</p>
      <Button label="Перейти к анализам" outlined class="mt-2" @click="router.push('/analyzes')" />
    </div>

    <div v-else class="cart-layout">

      <!-- Левый блок — позиции -->
      <div class="cart-items-section">
        <div class="flex justify-content-between align-items-center mb-3">
          <h1 class="m-0">Корзина</h1>
          <Button label="Очистить корзину" icon="pi pi-trash" text severity="danger" size="small" @click="clearCart" />
        </div>
        <div class="flex flex-column gap-2">
          <CartItemCard
            v-for="item in items"
            :key="`${item.type}-${item.id}`"
            :item="item"
            @remove="(i) => removeItem(i.id, i.type)"
          />
        </div>
      </div>

      <!-- Правый блок — оформление -->
      <div class="order-summary surface-card border-round shadow-1 p-4">
        <div class="flex justify-content-between align-items-center mb-4">
          <span class="font-bold text-lg">Оформление заказа</span>
          <span class="text-color-secondary text-sm">Позиции: {{ count }}</span>
        </div>

        <!-- Итого -->
        <div class="flex justify-content-between mb-2">
          <span class="text-color-secondary">Сумма без скидок</span>
          <span>{{ formatCurrency(grossTotal) }}</span>
        </div>
        <div v-if="totalDiscount > 0" class="flex justify-content-between mb-2 text-green-600">
          <span>Скидка</span>
          <span>−{{ formatCurrency(totalDiscount) }}</span>
        </div>
        <div class="flex justify-content-between font-bold text-xl mb-4 pt-3 border-top-1 surface-border">
          <span>Итого</span>
          <span>{{ formatCurrency(total) }}</span>
        </div>

        <!-- Пациент -->
        <div class="mb-4">
          <label class="font-medium block mb-2" style="font-size: 1rem;">Кто будет проходить исследование? <span class="text-red-500">*</span></label>
          <Select
            v-if="patients.length > 0 || patientsLoading"
            v-model="selectedPatient"
            :options="patients"
            :optionLabel="patientLabel"
            placeholder="Выберите пациента"
            class="w-full"
            :loading="patientsLoading"
            showClear
          />
          <div v-else class="no-patients border-round p-3 flex align-items-center justify-content-between gap-2">
            <span class="text-sm text-color-secondary">Нет добавленных пациентов</span>
            <Button
              label="Создать пациента"
              icon="pi pi-plus"
              size="small"
              outlined
              @click="router.push('/patients')"
            />
          </div>
          <small v-if="patientsError" class="p-error">{{ patientsError }}</small>
        </div>

        <Button
          label="Оформить заказ"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="w-full"
          :disabled="!selectedPatient"
          @click="goToCheckout"
        />
        <small class="text-color-secondary block text-center mt-2" v-if="!selectedPatient">
          Выберите пациента для оформления
        </small>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Select from 'primevue/select';
import CartItemCard from '@/components/CartItemCard.vue';
import { useCart } from '@/stores/cart';
import PatientService from '@/services/PatientService';

const router = useRouter();
const { items, count, total, totalDiscount, removeItem, clearCart } = useCart();

const patients = ref([]);
const selectedPatient = ref(null);
const patientsLoading = ref(false);
const patientsError = ref('');

const grossTotal = computed(() =>
  items.reduce((sum, item) => sum + (item.price || 0), 0)
);

const patientLabel = (p) => `${p.lastName} ${p.firstName}${p.middleName ? ' ' + p.middleName : ''}`;

const formatCurrency = (v) => {
  if (typeof v !== 'number') return '';
  return v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};

const loadPatients = async () => {
  patientsLoading.value = true;
  try {
    const response = await PatientService.getMyPatients({ page: 0, limit: 100 });
    patients.value = response.data.payload.content || [];
  } catch (e) {
    patientsError.value = 'Не удалось загрузить список пациентов';
  } finally {
    patientsLoading.value = false;
  }
};

const goToCheckout = () => {
  router.push({
    name: 'Checkout',
    state: { patient: JSON.stringify(selectedPatient.value) }
  });
};

onMounted(loadPatients);
</script>

<style scoped>
.cart-page {
  padding: 2rem 0;
}

.cart-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.cart-items-section {
  flex: 1 1 0;
  min-width: 0;
}

.no-patients {
  border: 1px dashed var(--surface-border);
  background: var(--surface-ground);
}

.order-summary {
  width: 340px;
  flex-shrink: 0;
  position: sticky;
  top: 1rem;
}
</style>
