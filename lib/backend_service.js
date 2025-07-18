import axios from "axios";

// Instance axios reusable untuk seluruh backend service
const backend = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Ganti sesuai baseURL backend kamu
  // Bisa tambahkan headers/interceptors di sini jika perlu
});

export default backend;

// Cara penggunaan:
// import backend from "@/lib/backend_service";
// backend.get("/endpoint");