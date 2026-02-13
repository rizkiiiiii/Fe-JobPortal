import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// ==============================================
// 1. INTERCEPTOR KEBERANGKATAN (REQUEST)
// ==============================================
api.interceptors.request.use(
    (config) => {
        // Cek saku (LocalStorage)
        const token = localStorage.getItem('token');
        
        // Kalau ada token, tempelkan ke Header 'Authorization'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==============================================
// 2. INTERCEPTOR KEDATANGAN (RESPONSE)
// ==============================================
api.interceptors.response.use(
    (response) => {
        // Kalau sukses (200), loloskan saja
        return response;
    },
    (error) => {
        // Kalau gagal, cek: Apakah errornya 401 (Unauthorized)?
        // Artinya token salah, kadaluwarsa, atau server me-reset
        if (error.response && error.response.status === 401) {
            
            // Hapus data sampah di lokal
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Paksa pindah ke halaman login
            // Kita pakai window.location karena file ini bukan React Component
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;