import axios from "axios";
import Cookies from 'js-cookie'; // Import Cookies

const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
});

// Request interceptor untuk menambahkan token JWT ke header
backend.interceptors.request.use(
  (config) => {
    // Kecualikan endpoint login dan superadmin/create dari penambahan token
    if (config.url !== '/auth/login' && config.url !== '/superadmin/create') {
      const token = Cookies.get('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backend; 