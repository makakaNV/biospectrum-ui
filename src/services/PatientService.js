import apiClient from './api';

const PatientService = {
  getMyPatients({ page = 0, limit = 15 }) {
    return apiClient.get('/patients/my', { params: { page, limit } });
  },

  createPatient(data) {
    return apiClient.post('/patients/create', data);
  },

  updatePatient(id, data) {
    return apiClient.put(`/patients/${id}`, data);
  },

  deletePatient(id) {
    return apiClient.delete(`/patients/${id}`);
  },

  getPatientById(id) {
    return apiClient.get(`/patients/${id}`);
  }
};

export default PatientService;
