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
    return apiClient.post('/auth/logout');
  },

  requestPasswordReset(email) {
    return apiClient.post('/auth/reset-password/request', null, { params: { email } });
  },

  confirmPasswordReset(dto) {
    return apiClient.post('/auth/reset-password/confirm', dto);
  }
};
