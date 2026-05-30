<template>
  <div class="patient-card p-3 border-round shadow-1" @click="router.push('/patients/' + patient.id)">

    <div class="flex align-items-center gap-2">
      <div class="gender-icon-wrap" :style="{ background: genderBg }">
        <i :class="genderIcon" :style="{ color: genderColor }"></i>
      </div>
      <div class="flex-grow-1 overflow-hidden">
        <div class="card-id">ID: {{ patient.id }}</div>
        <div class="card-name">{{ patient.lastName }} {{ patient.firstName }}</div>
        <div class="card-date">{{ formattedBirthDate }}</div>
      </div>
      <div class="flex flex-column gap-1" @click.stop>
        <Button icon="pi pi-receipt" text rounded size="small" aria-label="Заказы" @click="goToOrders" />
        <Button icon="pi pi-pencil" text rounded size="small" aria-label="Изменить" @click="emit('edit', patient)" />
        <Button icon="pi pi-trash" text rounded size="small" severity="danger" aria-label="Удалить" @click="confirmVisible = true" />
      </div>
    </div>

  </div>

  <!-- Диалог подтверждения удаления -->
  <Dialog
    v-model:visible="confirmVisible"
    header="Подтвердить удаление"
    :style="{ width: '360px' }"
    modal
    :draggable="false"
  >
    <div class="flex align-items-center gap-3">
      <span>
        Удалить пациента <strong>{{ patient.lastName }} {{ patient.firstName }}</strong>?
        Действие нельзя отменить.
      </span>
    </div>
    <template #footer>
      <Button label="Отмена" text severity="secondary" @click="confirmVisible = false" :disabled="isDeleting" />
      <Button label="Удалить" severity="danger" @click="deletePatient" :loading="isDeleting" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import PatientService from '@/services/PatientService';

const props = defineProps({
  patient: { type: Object, required: true }
});

const emit = defineEmits(['edit', 'deleted']);
const router = useRouter();

const confirmVisible = ref(false);
const isDeleting = ref(false);

const genderIcon = computed(() =>
  props.patient.gender === 'MALE' ? 'pi pi-mars' : 'pi pi-venus'
);
const genderColor = computed(() =>
  props.patient.gender === 'MALE' ? 'var(--blue-500)' : 'var(--pink-500)'
);
const genderBg = computed(() =>
  props.patient.gender === 'MALE' ? 'var(--blue-50)' : 'var(--pink-50)'
);

const formattedBirthDate = computed(() => {
  const val = props.patient.birthDate;
  if (!val) return 'Не указана';
  if (typeof val === 'string' && val.includes('-')) {
    const [y, m, d] = val.split('-');
    return `${d}.${m}.${y}`;
  }
  return new Date(val).toLocaleDateString('ru-RU');
});

const goToOrders = () => {
  router.push({ path: '/orders', query: { patientId: props.patient.id } });
};

async function deletePatient() {
  isDeleting.value = true;
  try {
    await PatientService.deletePatient(props.patient.id);
    confirmVisible.value = false;
    emit('deleted', props.patient.id);
  } catch (error) {
    console.error('Ошибка при удалении пациента:', error);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped>
.patient-card {
  width: 100%;
  max-width: 350px;
  box-sizing: border-box;
  background: #f0f5fb;
  border: 1px solid #dce8f4;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s, background 0.15s;
}

.patient-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  background: #e8f0fb;
}

.card-id {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.card-name {
  font-size: 1.15rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #0f172a;
  margin-top: 0.1rem;
}

.card-date {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.gender-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.2rem;
}
</style>
