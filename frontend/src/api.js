import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    'https://your-railway-app.up.railway.app/api'
});

export default api;
