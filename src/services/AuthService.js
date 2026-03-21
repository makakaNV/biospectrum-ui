import apiClient from './api';

export default {
  login(email, password) {
    return apiClient.post('/auth/login', {
      email,
      password
    });
  },

  register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  getMe() {
    // Предполагаем, что этот эндпоинт возвращает данные текущего пользователя,
    // если cookie авторизации валиден, иначе 401.
    return apiClient.get('/auth/profile');
  },

  logout() {
    // Предполагаем, что этот эндпоинт очищает HttpOnly cookie на сервере.
    return apiClient.post('/auth/logout');
  }
};
