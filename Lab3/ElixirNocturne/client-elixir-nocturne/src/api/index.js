import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7141/api',
    withCredentials: true,
});

export default api;
