<template>
  <div class="detail-page">

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-content-center pt-8">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>

    <template v-else-if="patient">

      <!-- Навигация назад -->
      <div class="mb-4">
        <Button label="Мои пациенты" icon="pi pi-arrow-left" text size="small" @click="router.push('/patients')" />
      </div>

      <!-- Шапка -->
      <div class="detail-hero border-round shadow-1 p-4 mb-3 flex align-items-center justify-content-between gap-3">
        <div class="flex align-items-center gap-3">
          <div class="gender-icon-wrap" :style="{ background: genderBg, color: genderColor }">
            <i :class="genderIcon" style="font-size: 1.4rem;"></i>
          </div>
          <div>
            <div class="text-xs text-color-secondary mb-1">ID: {{ patient.id }}</div>
            <div class="text-xl font-bold">
              {{ [patient.lastName, patient.firstName, patient.middleName].filter(Boolean).join(' ') }}
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <Button icon="pi pi-pencil" label="Изменить" outlined size="small" @click="openEdit" />
          <Button icon="pi pi-trash" severity="danger" outlined size="small" @click="confirmVisible = true" />
        </div>
      </div>

      <!-- Основные данные -->
      <div class="detail-section border-round shadow-1 p-4 mb-3">
        <div class="section-title mb-3">Основные данные</div>
        <div class="data-grid">
          <div class="data-row">
            <span class="data-label">Дата рождения</span>
            <span class="data-value">{{ formattedBirthDate }}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Пол</span>
            <span class="data-value">{{ formattedGender }}</span>
          </div>
          <div class="data-row">
            <span class="data-label">СНИЛС</span>
            <span class="data-value">{{ patient.snils || '—' }}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Телефон</span>
            <span class="data-value">{{ patient.phoneNumber || '—' }}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Email</span>
            <span class="data-value">{{ patient.email || '—' }}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Дата добавления</span>
            <span class="data-value">{{ formatDate(patient.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Клинический профиль -->
      <div class="detail-section border-round shadow-1 p-4">
        <div class="section-title mb-3">Клинический профиль</div>

        <div v-if="!patient.clinicalProfile" class="text-color-secondary text-sm">
          Клинический профиль не заполнен.
        </div>

        <div v-else class="data-grid">
          <div class="data-row">
            <span class="data-label">Курение</span>
            <span :class="['clinical-badge', patient.clinicalProfile.isSmoker ? 'badge--yes' : 'badge--no']">
              {{ patient.clinicalProfile.isSmoker ? 'Да' : 'Нет' }}
            </span>
          </div>
          <div class="data-row">
            <span class="data-label">Алкоголь</span>
            <span :class="['clinical-badge', patient.clinicalProfile.isAlcoholic ? 'badge--yes' : 'badge--no']">
              {{ patient.clinicalProfile.isAlcoholic ? 'Да' : 'Нет' }}
            </span>
          </div>
          <div v-if="patient.gender === 'FEMALE'" class="data-row">
            <span class="data-label">Беременность</span>
            <span :class="['clinical-badge', patient.clinicalProfile.isPregnant ? 'badge--yes' : 'badge--no']">
              {{ patient.clinicalProfile.isPregnant ? 'Да' : 'Нет' }}
            </span>
          </div>
          <div v-if="patient.gender === 'FEMALE' && patient.clinicalProfile.isPregnant" class="data-row">
            <span class="data-label">Триместр</span>
            <span class="data-value">{{ trimesterLabel(patient.clinicalProfile.trimester) }}</span>
          </div>
        </div>
      </div>

    </template>

    <Message v-if="error" severity="error" :closable="false" class="mt-3">{{ error }}</Message>

  </div>

  <!-- Диалог редактирования -->
  <PatientFormDialog
    v-if="patient"
    v-model:visible="editVisible"
    :patient="patient"
    @saved="onSaved"
  />

  <!-- Диалог подтверждения удаления -->
  <Dialog
    v-model:visible="confirmVisible"
    header="Подтвердить удаление"
    :style="{ width: '360px' }"
    modal
    :draggable="false"
  >
    <div class="flex align-items-center gap-3">
      <span v-if="patient">
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import PatientService from '@/services/PatientService';
import PatientFormDialog from '@/components/PatientFormDialog.vue';

const route = useRoute();
const router = useRouter();

const patient = ref(null);
const loading = ref(true);
const error = ref('');
const editVisible = ref(false);
const confirmVisible = ref(false);
const isDeleting = ref(false);

const genderIcon = computed(() => patient.value?.gender === 'MALE' ? 'pi pi-mars' : 'pi pi-venus');
const genderColor = computed(() => patient.value?.gender === 'MALE' ? 'var(--blue-500)' : 'var(--pink-500)');
const genderBg = computed(() => patient.value?.gender === 'MALE' ? 'var(--blue-50)' : 'var(--pink-50)');

const formattedBirthDate = computed(() => {
  const val = patient.value?.birthDate;
  if (!val) return '—';
  if (typeof val === 'string' && val.includes('-')) {
    const [y, m, d] = val.split('-');
    return `${d}.${m}.${y}`;
  }
  return new Date(val).toLocaleDateString('ru-RU');
});

const formattedGender = computed(() =>
  patient.value?.gender === 'MALE' ? 'Мужской' : 'Женский'
);

const formatDate = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
};

const trimesterLabel = (t) => {
  if (!t) return '—';
  return ['I триместр', 'II триместр', 'III триместр'][t - 1] ?? '—';
};

async function fetchPatient() {
  loading.value = true;
  error.value = '';
  try {
    const res = await PatientService.getPatientById(route.params.id);
    patient.value = res.data?.payload ?? null;
  } catch {
    error.value = 'Не удалось загрузить данные пациента.';
  } finally {
    loading.value = false;
  }
}

const openEdit = () => { editVisible.value = true; };

const onSaved = async () => { await fetchPatient(); };

async function deletePatient() {
  isDeleting.value = true;
  try {
    await PatientService.deletePatient(patient.value.id);
    router.push('/patients');
  } catch {
    error.value = 'Не удалось удалить пациента.';
    confirmVisible.value = false;
  } finally {
    isDeleting.value = false;
  }
}

onMounted(fetchPatient);
</script>

<style scoped>
.detail-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 0;
}

.detail-hero,
.detail-section {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.gender-icon-wrap {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
}

.data-grid {
  display: flex;
  flex-direction: column;
}

.data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-border);
  font-size: 0.9rem;
}

.data-row:last-child {
  border-bottom: none;
}

.data-label {
  color: var(--text-color-secondary);
}

.data-value {
  font-weight: 600;
  color: #1e293b;
}

.clinical-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.badge--yes {
  background: #f1f5f9;
  color: #64748b;
}

.badge--no {
  background: #f1f5f9;
  color: #64748b;
}
</style>
