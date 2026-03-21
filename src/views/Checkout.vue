<template>
  <div class="checkout-page">

    <!-- Шапка -->
    <div class="flex align-items-center gap-3 mb-4">
      <Button icon="pi pi-arrow-left" text rounded @click="router.back()" />
      <h1 class="m-0">Оформление заказа</h1>
    </div>

    <!-- Верхний блок: состав заказа + правая колонка -->
    <div class="top-grid mb-4">

      <!-- Состав заказа -->
      <div class="surface-card border-round shadow-1 p-4">
        <div class="font-bold text-lg mb-3">Состав заказа</div>
        <div class="flex flex-column gap-2">
          <div
            v-for="item in items"
            :key="`${item.type}-${item.id}`"
            class="flex justify-content-between align-items-start gap-2 py-2 border-bottom-1 surface-border"
          >
            <div class="flex-grow-1 min-w-0">
              <div class="font-medium text-sm">{{ item.name }}</div>
              <div class="text-xs text-color-secondary mt-1">{{ item.code }}</div>
            </div>
            <div class="flex-shrink-0 font-semibold text-sm">
              {{ formatCurrency(itemPrice(item)) }}
            </div>
          </div>
        </div>
        <div class="flex justify-content-between align-items-center pt-3 mt-2">
          <div>
            <div v-if="totalDiscount > 0" class="flex gap-3 text-sm text-color-secondary mb-1">
              <span>Скидка:</span>
              <span class="text-green-600">−{{ formatCurrency(totalDiscount) }}</span>
            </div>
            <div class="font-bold text-xl">Итого: {{ formatCurrency(total) }}</div>
          </div>
          <div class="text-color-secondary text-sm">{{ items.length }} {{ itemsWord }}</div>
        </div>
      </div>

      <!-- Правая колонка: пациент + офис -->
      <div class="flex flex-column gap-3">

        <!-- Пациент -->
        <div class="surface-card border-round shadow-1 p-4">
          <div class="font-bold text-lg mb-3">Пациент</div>
          <div v-if="patient" class="flex align-items-start gap-3">
            <div class="patient-icon-wrap" :style="{ background: patient.gender === 'MALE' ? 'var(--blue-50)' : 'var(--pink-50)' }">
              <i :class="patient.gender === 'MALE' ? 'pi pi-mars' : 'pi pi-venus'"
                 :style="{ color: patient.gender === 'MALE' ? 'var(--blue-500)' : 'var(--pink-500)' }"></i>
            </div>
            <div class="flex flex-column gap-1 text-sm">
              <div class="font-bold text-base">{{ patient.lastName }} {{ patient.firstName }} {{ patient.middleName }}</div>
              <div v-if="patient.birthDate" class="text-color-secondary">
                <i class="pi pi-calendar mr-1 text-xs"></i>{{ formatDate(patient.birthDate) }}
              </div>
              <div v-if="patient.phoneNumber" class="text-color-secondary">
                <i class="pi pi-phone mr-1 text-xs"></i>{{ patient.phoneNumber }}
              </div>
              <div v-if="patient.email" class="text-color-secondary">
                <i class="pi pi-envelope mr-1 text-xs"></i>{{ patient.email }}
              </div>
              <div v-if="patient.snils" class="text-color-secondary">
                <i class="pi pi-id-card mr-1 text-xs"></i>СНИЛС: {{ patient.snils }}
              </div>
            </div>
          </div>
          <div v-else class="text-color-secondary text-sm">Пациент не выбран</div>
        </div>

        <!-- Выбранный офис -->
        <div class="surface-card border-round shadow-1 p-4">
          <div class="font-bold text-lg mb-2">Выбранный офис</div>
          <div class="text-color-secondary text-sm">Офис не выбран</div>
        </div>

      </div>
    </div>

    <!-- Оплата -->
    <div class="surface-card border-round shadow-1 p-4">
      <div class="font-bold text-lg mb-4">Способ оплаты</div>

      <div class="flex gap-3 mb-4">
        <div
          class="payment-option"
          :class="{ selected: paymentMethod === 'card' }"
          @click="paymentMethod = 'card'"
        >
          <i class="pi pi-credit-card text-xl mb-2"></i>
          <span class="font-medium">Картой онлайн</span>
        </div>
        <div
          class="payment-option"
          :class="{ selected: paymentMethod === 'office' }"
          @click="paymentMethod = 'office'"
        >
          <i class="pi pi-building text-xl mb-2"></i>
          <span class="font-medium">Оплатить в офисе</span>
        </div>
      </div>

      <!-- Форма карты -->
      <div v-if="paymentMethod === 'card'" class="card-form mb-4">
        <div class="flex flex-column gap-3">

          <div class="flex flex-column gap-1">
            <label class="text-sm font-medium">Номер карты</label>
            <InputMask
              v-model="card.number"
              mask="9999 9999 9999 9999"
              placeholder="0000 0000 0000 0000"
              :class="{ 'p-invalid': cardErrors.number }"
              @blur="validateCard"
              class="w-full"
            />
            <small class="p-error" v-if="cardErrors.number">{{ cardErrors.number }}</small>
          </div>

          <div class="flex gap-3">
            <div class="flex flex-column gap-1 flex-1">
              <label class="text-sm font-medium">Срок действия</label>
              <InputMask
                v-model="card.expiry"
                mask="99/99"
                placeholder="MM/ГГ"
                :class="{ 'p-invalid': cardErrors.expiry }"
                @blur="validateCard"
              />
              <small class="p-error" v-if="cardErrors.expiry">{{ cardErrors.expiry }}</small>
            </div>
            <div class="flex flex-column gap-1" style="width: 130px;">
              <label class="text-sm font-medium">CVV</label>
              <InputMask
                v-model="card.cvv"
                mask="999"
                placeholder="•••"
                :class="{ 'p-invalid': cardErrors.cvv }"
                @blur="validateCard"
              />
              <small class="p-error" v-if="cardErrors.cvv">{{ cardErrors.cvv }}</small>
            </div>
          </div>

        </div>
      </div>

      <div v-if="paymentMethod === 'office'" class="office-info mb-4">
        <i class="pi pi-info-circle mr-2 text-color-secondary"></i>
        <span class="text-color-secondary text-sm">Вы сможете оплатить заказ наличными или картой при посещении офиса.</span>
      </div>

      <Message v-if="orderError" severity="error" :closable="false" class="mb-3">{{ orderError }}</Message>

      <Button
        :label="paymentMethod === 'card' ? 'Оплатить ' + formatCurrency(total) : 'Подтвердить заказ'"
        :icon="paymentMethod === 'card' ? 'pi pi-lock' : 'pi pi-check'"
        class="w-full"
        size="large"
        :disabled="!canPay"
        :loading="isSubmitting"
        @click="submitOrder"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import Message from 'primevue/message';
import { useCart } from '@/stores/cart';
import OrderService from '@/services/OrderService';

const router = useRouter();
const { items, total, totalDiscount, itemPrice, clearCart } = useCart();

const patient = ref(
  history.state?.patient ? JSON.parse(history.state.patient) : null
);

const paymentMethod = ref(null);
const card = reactive({ number: '', expiry: '', cvv: '' });
const cardErrors = reactive({ number: '', expiry: '', cvv: '' });
const orderError = ref('');
const isSubmitting = ref(false);

const validateCard = () => {
  cardErrors.number = '';
  cardErrors.expiry = '';
  cardErrors.cvv = '';

  const digits = card.number.replace(/\D/g, '');
  if (digits.length > 0 && digits.length < 16) cardErrors.number = 'Введите 16 цифр';

  if (card.expiry && card.expiry.length === 5) {
    const [mm, yy] = card.expiry.split('/').map(Number);
    const expDate = new Date(2000 + yy, mm - 1, 1);
    const now = new Date();
    if (mm < 1 || mm > 12) cardErrors.expiry = 'Неверный месяц';
    else if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) cardErrors.expiry = 'Карта просрочена';
  }

  if (card.cvv && card.cvv.replace(/\D/g, '').length < 3) cardErrors.cvv = 'Введите 3 цифры';
};

const isCardValid = computed(() => {
  const digits = card.number.replace(/\D/g, '');
  const expiryOk = card.expiry.length === 5 && (() => {
    const [mm, yy] = card.expiry.split('/').map(Number);
    const expDate = new Date(2000 + yy, mm - 1, 1);
    const now = new Date();
    return mm >= 1 && mm <= 12 && expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  })();
  const cvvOk = card.cvv.replace(/\D/g, '').length === 3;
  return digits.length === 16 && expiryOk && cvvOk &&
    !cardErrors.number && !cardErrors.expiry && !cardErrors.cvv;
});

const canPay = computed(() => {
  if (!paymentMethod.value) return false;
  if (paymentMethod.value === 'card') return isCardValid.value;
  return true;
});

const buildAnalysesIds = () => {
  const ids = new Set();
  for (const item of items) {
    if (item.type === 'analysis') {
      ids.add(item.id);
    } else if (item.type === 'panel' && item.analyses?.length) {
      item.analyses.forEach(a => ids.add(a.id));
    }
  }
  return Array.from(ids);
};

const buildComment = (analysesIds) => {
  const snils = patient.value?.snils || '';
  const names = items
    .map(item => item.type === 'analysis'
      ? item.name
      : item.analyses?.map(a => a.name).join(', ') || item.name
    )
    .join(', ');
  return `${snils} - ${names}`;
};

const submitOrder = async () => {
  isSubmitting.value = true;
  orderError.value = '';
  try {
    const analysesIds = buildAnalysesIds();
    const payload = {
      patientId: patient.value.id,
      analysesIds,
      comment: buildComment(analysesIds),
    };

    await OrderService.createOrder(payload);
    clearCart();
    router.push('/orders');
  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data?.error;
    orderError.value = msg || 'Ошибка при оформлении заказа. Попробуйте ещё раз.';
  } finally {
    isSubmitting.value = false;
  }
};

const itemsWord = computed(() => {
  const n = items.length;
  if (n % 10 === 1 && n % 100 !== 11) return 'позиция';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'позиции';
  return 'позиций';
});

const formatCurrency = (v) => {
  if (typeof v !== 'number') return '';
  return v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};

const formatDate = (val) => {
  if (!val) return '';
  if (typeof val === 'string' && val.includes('-')) {
    const [y, m, d] = val.split('-');
    return `${d}.${m}.${y}`;
  }
  return new Date(val).toLocaleDateString('ru-RU');
};
</script>

<style scoped>
.checkout-page {
  padding: 2rem 0;
  max-width: 900px;
  margin: 0 auto;
}

.top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}

.patient-icon-wrap {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.3rem;
}

.payment-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1rem;
  border: 2px solid var(--surface-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-color-secondary);
  background: var(--surface-ground);
  gap: 0.25rem;
}

.payment-option:hover {
  border-color: var(--primary-color);
  color: var(--text-color);
}

.payment-option.selected {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #15803d;
}

.card-form {
  background: var(--surface-ground);
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid var(--surface-border);
  max-width: 400px;
  margin: 0 auto;
}

.office-info {
  background: var(--surface-ground);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--surface-border);
}
</style>
