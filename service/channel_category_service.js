import backend from "../lib/backend_service";

const channelCategoryService = {
  async getAll() {
    const res = await backend.get("/channel-categories");
    return res.data;
  },
  async getById(id) {
    const res = await backend.get(`/channel-categories/${id}`);
    return res.data;
  },
  async getByBusinessId(businessId) {
    const res = await backend.get(`/channel-categories/business/${businessId}`);
    return res.data;
  },
  async create(category) {
    const res = await backend.post("/channel-categories", category);
    return res.data;
  },
  async update(id, category) {
    const res = await backend.put(`/channel-categories/${id}`, category);
    return res.data;
  },
  async remove(id) {
    const res = await backend.delete(`/channel-categories/${id}`);
    return res.data;
  },
};

export default channelCategoryService; 