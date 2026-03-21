import apiClient from './api';

const PanelService = {
  getPanels({ page = 0, limit = 20 }) {
    return apiClient.get('/panels/all', { params: { page, limit } });
  },

  getPanelsByGroup(groupCode, { page = 0, limit = 20 }) {
    return apiClient.get(`/panels/all/${groupCode}`, { params: { page, limit } });
  },

  getGroups({ page = 0, limit = 100 }) {
    return apiClient.get('/panels-group/all', { params: { page, limit } });
  }
};

export default PanelService;
