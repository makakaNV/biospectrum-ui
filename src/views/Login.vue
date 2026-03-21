<template>
  <div class="flex justify-content-center align-items-center min-h-screen">
    <Card style="width: 25rem;">
      <template #title>
        <div class="text-center">Вход в Биоспектр</div>
      </template>
      <template #content>
        <div class="flex flex-column gap-4">
          <div class="p-float-label">
            <InputText id="email" v-model="email" class="w-full" />
            <label for="email">Email</label>
          </div>
          <div class="p-float-label">
            <Password id="password" v-model="password" class="w-full" :feedback="false" :toggleMask="true" />
            <label for="password">Пароль</label>
          </div>
          <Button label="Войти" @click="login" class="w-full"></Button>
          <div class="text-center mt-2">
            <router-link to="/register">Нет аккаунта? Зарегистрироваться</router-link>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import AuthService from '@/services/AuthService';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await AuthService.login(email.value, password.value);
    const token = response.data?.payload?.token;
    if (token) {
      localStorage.setItem('authToken', token);
    }
    await router.push('/');

  } catch (error) {
    console.error('Ошибка входа:', error.response ? error.response.data : error.message);
    // Здесь мы позже добавим всплывающее уведомление об ошибке
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: calc(100vh - 4rem); /* Вычитаем паддинг из #app */
}
</style>
