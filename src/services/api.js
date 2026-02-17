import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productAPI = {
    getAll: () => api.get('/products'),
    create: (product) => api.post('/products', product),
    delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
    getAll: () => api.get('/orders'),
    create: (order) => api.post('/orders', order),
};

export const messageAPI = {
    getAll: (contactId) => api.get(`/messages${contactId ? `?contactId=${contactId}` : ''}`),
    send: (message) => api.post('/messages', message),
};

export default api;
