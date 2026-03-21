import apiClient from './api';

const UserService = {
  getMe() {
    return apiClient.get('/users/me');
  }
};

export default UserService;
