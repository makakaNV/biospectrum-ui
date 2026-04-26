import apiClient from './api';

const AnalysisService = {
  getAnalyses({ page = 0, limit = 10 }) {
    return apiClient.get('/analyses/all', { params: { page, limit } });
  },

  getAnalysesByCategory(categoryCode, { page = 0, limit = 20 }) {
    return apiClient.get(`/analyses/all/${categoryCode}`, { params: { page, limit } });
  },

  getCategories({ page = 0, limit = 100 }) {
    return apiClient.get('/categories/all', { params: { page, limit } });
  },

  searchAnalyses(body, { page = 0, limit = 20 }) {
    return apiClient.post('/analyses/search', body, { params: { page, limit } });
  },

  getAnalysesByIds(ids) {
    return apiClient.post('/analyses/ids', ids);
  }
};

export default AnalysisService;
