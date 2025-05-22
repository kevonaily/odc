import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration d'Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs globalement ici
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Service pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs avec pagination et recherche
  getUsers: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await api.get('/users', { 
      params: { page, limit, search } 
    });
    return response.data;
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Créer un nouvel utilisateur
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Mettre à jour un utilisateur existant
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default api;