import apiClient from './api';

const OrderService = {
  createOrder(data) {
    return apiClient.post('/orders', data);
  },

  getMyOrders({ page = 0, limit = 15 }) {
    return apiClient.get('/orders/my', { params: { page, limit } });
  },

  getTestResults(orderId) {
    return apiClient.get(`/tests/results/order/${orderId}`);
  }
};

export default OrderService;
