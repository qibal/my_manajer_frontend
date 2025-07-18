import backend from "../lib/backend_service";

// Service CRUD untuk resource /businesses
const businessService = {
  // Ambil semua bisnis
  async getAll() {
    const res = await backend.get("/businesses");
    return res.data;
  },
  // Ambil bisnis by ID
  async getById(id) {
    const res = await backend.get(`/businesses/${id}`);
    return res.data;
  },
  // Tambah bisnis baru
  async create(business) {
    const res = await backend.post("/businesses", business);
    return res.data;
  },
  // Update bisnis
  async update(id, business) {
    const res = await backend.put(`/businesses/${id}`, business);
    return res.data;
  },
  // Hapus bisnis
  async remove(id) {
    const res = await backend.delete(`/businesses/${id}`);
    return res.data;
  },
};

export default businessService;

// Cara penggunaan:
// import businessService from "../service/business_service";
// businessService.getAll().then(...)