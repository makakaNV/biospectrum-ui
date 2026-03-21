<template>
  <div class="patients-page">
    <h1 class="mb-4">Мои Пациенты</h1>

    <div v-if="patients.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="patient in patients" :key="patient.id" class="col">
        <PatientCard :patient="patient" @edit="openEditDialog" @deleted="onPatientDeleted" />
      </div>
      <div class="col flex align-items-center justify-content-center">
        <Button label="Добавить нового пациента" icon="pi pi-plus" outlined @click="openCreateDialog" class="w-full h-full" />
      </div>
    </div>

    <div v-else-if="!isLoading && patients.length === 0" class="text-center mt-5">
      <p class="text-lg">У вас пока нет привязанных пациентов.</p>
      <Button label="Создать пациента" icon="pi pi-user-plus" @click="openCreateDialog" class="mt-3" />
    </div>

    <div class="flex justify-content-center mt-4" v-if="hasMore">
      <Button
        label="Показать еще"
        @click="loadPatients"
        :loading="isLoading"
        :disabled="isLoading"
      />
    </div>
  </div>

  <PatientFormDialog
    v-model:visible="dialogVisible"
    :patient="editingPatient"
    @saved="onPatientSaved"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import PatientService from '@/services/PatientService';
import PatientCard from '@/components/PatientCard.vue';
import PatientFormDialog from '@/components/PatientFormDialog.vue';

const router = useRouter();
const patients = ref([]);
const page = ref(0);
const limit = ref(15);
const isLoading = ref(false);
const hasMore = ref(true);

const loadPatients = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const response = await PatientService.getMyPatients({ page: page.value, limit: limit.value });
    const newPatients = response.data.payload.content || [];
    patients.value.push(...newPatients);
    
    page.value++;
    hasMore.value = response.data.payload.pagination.page < response.data.payload.pagination.pages - 1;

  } catch (error) {
    console.error('Ошибка при загрузке пациентов:', error);
    // При 401 ошибке (неаутентифицирован) перенаправляем на логин
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
    hasMore.value = false; // Прекращаем попытки при ошибке
  } finally {
    isLoading.value = false;
  }
};

const dialogVisible = ref(false);
const editingPatient = ref(null);

const openCreateDialog = () => {
  editingPatient.value = null;
  dialogVisible.value = true;
};

const openEditDialog = (patient) => {
  editingPatient.value = patient;
  dialogVisible.value = true;
};

const onPatientDeleted = (patientId) => {
  patients.value = patients.value.filter(p => p.id !== patientId);
};

const onPatientSaved = (savedPatient) => {
  if (editingPatient.value) {
    const idx = patients.value.findIndex(p => p.id === savedPatient.id);
    if (idx !== -1) patients.value[idx] = savedPatient;
  } else {
    patients.value.unshift(savedPatient);
  }
};

onMounted(() => {
  loadPatients();
});
</script>

<style scoped>
.patients-page {
  padding: 2rem 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 300px - примерная ширина карточки */
}
.col {
  display: flex;
}
</style>