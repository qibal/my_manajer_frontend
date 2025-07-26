import axios from "axios";
// Hapus import Cookies

const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "mymanajerbackend-production.up.railway.app",
});

// Request interceptor untuk menambahkan token JWT dari localStorage ke header
backend.interceptors.request.use(
  (config) => {
    // Kecualikan endpoint login dan superadmin/create dari penambahan token
    if (config.url !== '/auth/login' && config.url !== '/superadmin/create') {
      const token = localStorage.getItem('jwt_token'); // Mengambil token dari localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token sent:", token); // Untuk debugging
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backend; 