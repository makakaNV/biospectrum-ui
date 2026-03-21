<template>
  <div class="flex justify-content-center align-items-center min-h-screen">
    <Card style="width: 25rem;">
      <template #title>
        <div class="text-center">Регистрация</div>
      </template>
      <template #content>
        <div class="flex flex-column gap-4">
          <div class="p-float-label">
            <InputText id="username" v-model="form.username" class="w-full" />
            <label for="username">Имя пользователя</label>
          </div>
          <div class="p-float-label">
            <InputText id="email" v-model="form.email" class="w-full" />
            <label for="email">Email</label>
          </div>
          <div class="p-float-label">
            <Password id="password" v-model="form.password" class="w-full" :feedback="false" :toggleMask="true" />
            <label for="password">Пароль</label>
          </div>
           <div class="p-float-label">
            <Password id="confirmPassword" v-model="form.confirmPassword" class="w-full" :feedback="false" :toggleMask="true" />
            <label for="confirmPassword">Подтвердите пароль</label>
          </div>
          <Button label="Зарегистрироваться" @click="register" class="w-full"></Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import AuthService from '@/services/AuthService';

const router = useRouter();
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const register = async () => {
  if (form.password !== form.confirmPassword) {
    console.error('Пароли не совпадают');
    // Позже здесь будет всплывающее уведомление
    return;
  }
  try {
    await AuthService.register(form);
    // При успешной регистрации сервер устанавливает cookie, просто перенаправляем
    await router.push('/');
  } catch (error) {
    console.error('Ошибка регистрации:', error.response ? error.response.data : error.message);
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: calc(100vh - 4rem);
}
</style>
