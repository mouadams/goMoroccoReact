import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export interface Stade {
  id: number;
  nom: string;
  ville: string;
  capacite: number;
  image: File | string;
  description: string;
  lat: number;
  lng: number;
  anneeConstruction: number;
}

export const stadeApi = {
  // Create a new stade
  create: async (formData: FormData) => {
    const response = await api.post('/stades', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all stades
  getAll: async () => {
    const response = await api.get('/stades');
    return response.data;
  },

  // Get a single stade by ID
  getById: async (id: number) => {
    const response = await api.get(`/stades/${id}`);
    return response.data;
  },

  // Update a stade
  update: async (id: number, formData: FormData) => {
    formData.append('_method', 'PUT'); // Laravel requires this for PUT requests with FormData
    const response = await api.post(`/stades/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a stade
  delete: async (id: number) => {
    const response = await api.delete(`/stades/${id}`);
    return response.data;
  },
};

export default api; 