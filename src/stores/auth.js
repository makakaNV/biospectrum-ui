import { ref } from 'vue';

// Инициализируем сразу из localStorage — чтобы меню не мигало при загрузке.
// App.vue корректирует значение после проверки getMe() (на случай протухшего токена).
export const isLoggedIn = ref(!!localStorage.getItem('authToken'));
