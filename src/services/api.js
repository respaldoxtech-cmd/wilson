import axios from 'axios';

const API_URL = '/api';

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
    async getMessages(contactId = null) {
        const url = contactId ? `${API_URL}/messages?contactId=${contactId}` : `${API_URL}/messages`;
        const res = await axios.get(url);
        return res.data;
    }
};

export const userAPI = {
    async getUsers() {
        const res = await axios.get(`${API_URL}/users`);
        return res.data;
    },
    async updateRole(id, role) {
        const res = await axios.patch(`${API_URL}/users/${id}`, { role });
        return res.data;
    },
    async deleteUser(id) {
        const res = await axios.delete(`${API_URL}/users/${id}`);
        return res.data;
    }
};

export default api;
