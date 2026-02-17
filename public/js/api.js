const API_URL = '/api';

const api = {
    // Products
    async getProducts() {
        const res = await fetch(`${API_URL}/products`);
        return await res.json();
    },

    // Auth
    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await res.json();
    },

    async register(nombre, email, password) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });
        return await res.json();
    },

    // Orders
    async createOrder(orderData) {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return await res.json();
    },

    // Messages (for comments or contact)
    async sendMessage(messageData) {
        const res = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        });
        return await res.json();
    }
};

window.pgApi = api;
