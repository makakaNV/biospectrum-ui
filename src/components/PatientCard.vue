<template>
  <div class="patient-card p-3 border-round shadow-1 flex flex-column" @click="router.push('/patients/' + patient.id)">

    <!-- Шапка: иконка пола, имя, кнопки -->
    <div class="flex align-items-center">
      <div class="gender-icon-wrap mr-3" :style="{ background: genderBg }">
        <i :class="genderIcon" :style="{ color: genderColor }"></i>
      </div>
      <div class="flex-grow-1 overflow-hidden">
        <div class="text-xs text-color-secondary">ID: {{ patient.id }}</div>
        <div class="font-bold text-base white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {{ patient.lastName }} {{ patient.firstName }}
        </div>
        <div class="text-xs text-color-secondary mt-1">{{ formattedBirthDate }}</div>
      </div>
      <div class="flex gap-1 ml-2" @click.stop>
        <Button icon="pi pi-pencil" text rounded aria-label="Изменить" @click="emit('edit', patient)" />
        <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Удалить" @click="confirmVisible = true" />
      </div>
    </div>

    <!-- Кнопка анализов -->
    <div class="mt-3 pt-3 border-top-1 surface-border" @click.stop>
      <Button
        label="Анализы"
        icon="pi pi-chart-bar"
        outlined
        size="small"
        class="w-full"
        @click="emit('analyzes', patient)"
      />
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

const emit = defineEmits(['edit', 'deleted', 'analyzes']);
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

const formattedGender = computed(() =>
  props.patient.gender === 'MALE' ? 'Мужской' : 'Женский'
);

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
  transition: box-shadow 0.15s, transform 0.15s;
}

.patient-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
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
