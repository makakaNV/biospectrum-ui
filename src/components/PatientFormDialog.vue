<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isEdit ? 'Редактировать пациента' : 'Новый пациент'"
    :style="{ width: '480px' }"
    modal
    :draggable="false"
    :closable="!isLoading"
  >
    <div class="flex flex-column gap-3 pt-2">

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Фамилия <span class="text-red-500">*</span></label>
        <InputText v-model="form.lastName" :class="{ 'p-invalid': errors.lastName }" placeholder="Иванов" />
        <small class="p-error" v-if="errors.lastName">{{ errors.lastName }}</small>
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Имя <span class="text-red-500">*</span></label>
        <InputText v-model="form.firstName" :class="{ 'p-invalid': errors.firstName }" placeholder="Иван" />
        <small class="p-error" v-if="errors.firstName">{{ errors.firstName }}</small>
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Отчество</label>
        <InputText v-model="form.middleName" placeholder="Иванович" />
      </div>

      <div class="flex gap-3">
        <div class="flex flex-column gap-1 flex-1">
          <label class="font-medium text-sm">Дата рождения <span class="text-red-500">*</span></label>
          <DatePicker
            v-model="form.birthDate"
            dateFormat="dd.mm.yy"
            :class="{ 'p-invalid': errors.birthDate }"
            showIcon
            :maxDate="new Date()"
            placeholder="дд.мм.гггг"
            class="w-full"
          />
          <small class="p-error" v-if="errors.birthDate">{{ errors.birthDate }}</small>
        </div>

        <div class="flex flex-column gap-1 flex-1">
          <label class="font-medium text-sm">Пол <span class="text-red-500">*</span></label>
          <Select
            v-model="form.gender"
            :options="genderOptions"
            optionLabel="label"
            optionValue="value"
            :class="{ 'p-invalid': errors.gender }"
            placeholder="Выберите"
            class="w-full"
          />
          <small class="p-error" v-if="errors.gender">{{ errors.gender }}</small>
        </div>
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">СНИЛС <span class="text-red-500">*</span></label>
        <InputMask v-model="form.snils" mask="999-999-999 99" :class="{ 'p-invalid': errors.snils }" placeholder="123-456-789 00" />
        <small class="p-error" v-if="errors.snils">{{ errors.snils }}</small>
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Телефон</label>
        <InputMask v-model="form.phoneNumber" mask="+7 (999) 999-99-99" :class="{ 'p-invalid': errors.phoneNumber }" placeholder="+7 (999) 999-99-99" />
        <small class="p-error" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</small>
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Email</label>
        <InputText v-model="form.email" :class="{ 'p-invalid': errors.email }" placeholder="example@mail.ru" />
        <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
      </div>

      <!-- Клинический профиль -->
      <div class="clinical-divider">
        <span>Клинический профиль</span>
      </div>
      <p class="clinical-hint">Заполните клинический профиль, чтобы получить точные результаты</p>

      <div class="flex flex-column gap-3">

        <div class="clinical-row">
          <span class="clinical-label">Курение</span>
          <SelectButton
            v-model="form.clinicalProfile.isSmoker"
            :options="boolOptions"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div class="clinical-row">
          <span class="clinical-label">Алкоголь</span>
          <SelectButton
            v-model="form.clinicalProfile.isAlcoholic"
            :options="boolOptions"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <template v-if="form.gender === 'FEMALE'">
          <div class="clinical-row">
            <span class="clinical-label">Беременность</span>
            <SelectButton
              v-model="form.clinicalProfile.isPregnant"
              :options="boolOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <div v-if="form.clinicalProfile.isPregnant" class="clinical-row">
            <span class="clinical-label">Триместр</span>
            <SelectButton
              v-model="form.clinicalProfile.trimester"
              :options="trimesterOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>
        </template>

      </div>

      <Message v-if="serverError" severity="error" :closable="false" class="mt-1">{{ serverError }}</Message>
      <Message v-if="successMessage" severity="success" :closable="false" class="mt-1">{{ successMessage }}</Message>

    </div>

    <template #footer>
      <Button label="Отмена" text severity="secondary" @click="$emit('update:visible', false)" :disabled="isLoading" />
      <Button
        :label="isEdit ? 'Сохранить' : 'Создать'"
        :icon="isEdit ? 'pi pi-save' : 'pi pi-user-plus'"
        @click="submit"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Message from 'primevue/message';
import PatientService from '@/services/PatientService';

const props = defineProps({
  visible: { type: Boolean, required: true },
  patient: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'saved']);

const isEdit = computed(() => !!props.patient);
const isLoading = ref(false);
const serverError = ref('');
const successMessage = ref('');

const genderOptions = [
  { label: 'Мужской', value: 'MALE' },
  { label: 'Женский', value: 'FEMALE' }
];

const boolOptions = [
  { label: '+', value: true },
  { label: '−', value: false }
];

const trimesterOptions = [
  { label: 'I', value: 1 },
  { label: 'II', value: 2 },
  { label: 'III', value: 3 }
];

const emptyClinicalProfile = () => ({
  isSmoker: false,
  isAlcoholic: false,
  isPregnant: false,
  trimester: null
});

const emptyForm = () => ({
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: null,
  gender: null,
  snils: '',
  phoneNumber: '',
  email: '',
  clinicalProfile: emptyClinicalProfile()
});

const form = ref(emptyForm());
const errors = ref({});

watch(() => props.visible, (val) => {
  if (val) {
    serverError.value = '';
    successMessage.value = '';
    errors.value = {};
    if (props.patient) {
      const cp = props.patient.clinicalProfile;
      form.value = {
        lastName: props.patient.lastName || '',
        firstName: props.patient.firstName || '',
        middleName: props.patient.middleName || '',
        birthDate: props.patient.birthDate ? parseBirthDate(props.patient.birthDate) : null,
        gender: props.patient.gender || null,
        snils: formatSnils(props.patient.snils || ''),
        phoneNumber: props.patient.phoneNumber || '',
        email: props.patient.email || '',
        clinicalProfile: {
          isSmoker: cp?.isSmoker ?? false,
          isAlcoholic: cp?.isAlcoholic ?? false,
          isPregnant: cp?.isPregnant ?? false,
          trimester: cp?.trimester ?? null
        }
      };
    } else {
      form.value = emptyForm();
    }
  }
});

// Сброс беременности при смене пола на мужской
watch(() => form.value.gender, (val) => {
  if (val === 'MALE') {
    form.value.clinicalProfile.isPregnant = false;
    form.value.clinicalProfile.trimester = null;
  }
});

// Сброс триместра при снятии беременности
watch(() => form.value.clinicalProfile.isPregnant, (val) => {
  if (!val) form.value.clinicalProfile.trimester = null;
});

function parseBirthDate(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

function formatSnils(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11) return raw;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)} ${digits.slice(9, 11)}`;
}

function validate() {
  const e = {};
  if (!form.value.lastName?.trim()) e.lastName = 'Обязательное поле';
  if (!form.value.firstName?.trim()) e.firstName = 'Обязательное поле';
  if (!form.value.birthDate) e.birthDate = 'Обязательное поле';
  if (!form.value.gender) e.gender = 'Обязательное поле';

  const snilsDigits = (form.value.snils || '').replace(/\D/g, '');
  if (!snilsDigits) {
    e.snils = 'Обязательное поле';
  } else if (snilsDigits.length !== 11) {
    e.snils = 'СНИЛС должен содержать ровно 11 цифр';
  }

  if (form.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.email)) e.email = 'Некорректный email';
  }

  errors.value = e;
  return Object.keys(e).length === 0;
}

function formatDateToISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function submit() {
  if (!validate()) return;

  serverError.value = '';
  successMessage.value = '';
  isLoading.value = true;

  const cp = form.value.clinicalProfile;
  const clinicalProfile = {
    isSmoker: cp.isSmoker,
    isAlcoholic: cp.isAlcoholic,
    isPregnant: form.value.gender === 'FEMALE' ? cp.isPregnant : false,
    ...(form.value.gender === 'FEMALE' && cp.isPregnant && cp.trimester != null
      ? { trimester: cp.trimester }
      : {})
  };

  const payload = {
    lastName: form.value.lastName.trim(),
    firstName: form.value.firstName.trim(),
    middleName: form.value.middleName?.trim() || undefined,
    birthDate: formatDateToISO(form.value.birthDate),
    gender: form.value.gender,
    snils: (form.value.snils || '').replace(/\D/g, ''),
    phoneNumber: form.value.phoneNumber || undefined,
    email: form.value.email?.trim() || undefined,
    clinicalProfile
  };

  try {
    let response;
    if (isEdit.value) {
      response = await PatientService.updatePatient(props.patient.id, payload);
    } else {
      response = await PatientService.createPatient(payload);
    }
    successMessage.value = isEdit.value ? 'Данные пациента обновлены' : 'Пациент успешно создан';
    setTimeout(() => {
      emit('saved', response.data?.payload);
      emit('update:visible', false);
    }, 800);
  } catch (error) {
    const data = error.response?.data;

    if (data?.message === 'Validation failed' && data?.payload && typeof data.payload === 'object') {
      const fieldErrors = {};
      const translations = {
        phoneNumber: 'Некорректный номер телефона',
        email:       'Некорректный email',
        snils:       'Некорректный СНИЛС',
        firstName:   'Некорректное имя',
        lastName:    'Некорректная фамилия',
        birthDate:   'Некорректная дата рождения',
      };
      for (const [field, msg] of Object.entries(data.payload)) {
        fieldErrors[field] = translations[field] || msg;
      }
      errors.value = { ...errors.value, ...fieldErrors };
      return;
    }

    const msg = data?.message || '';
    if (msg.includes('already exists')) {
      const fieldErrors = {};
      if (msg.toLowerCase().includes('email'))       fieldErrors.email = 'Пациент с таким email уже существует';
      if (msg.toLowerCase().includes('snils'))       fieldErrors.snils = 'Пациент с таким СНИЛС уже существует';
      if (msg.toLowerCase().includes('phonenumber')) fieldErrors.phoneNumber = 'Пациент с таким номером телефона уже существует';
      if (Object.keys(fieldErrors).length > 0) {
        errors.value = { ...errors.value, ...fieldErrors };
        return;
      }
    }

    serverError.value = msg || 'Произошла ошибка. Попробуйте ещё раз.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.clinical-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.clinical-divider::before,
.clinical-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.clinical-divider span {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
  white-space: nowrap;
}

.clinical-hint {
  font-size: 0.8125rem;
  color: #64748b;
  margin: -0.5rem 0 0;
  text-align: center;
}

.clinical-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.clinical-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
</style>
