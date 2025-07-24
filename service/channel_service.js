import backend from "../lib/backend_service";

const channelService = {
  async getAll() {
    const res = await backend.get("/channels");
    return res.data;
  },
  async getById(id) {
    const res = await backend.get(`/channels/${id}`);
    return res.data;
  },
  async getByBusinessId(businessId) {
    const res = await backend.get(`/channels/business/${businessId}`);
    return res.data;
  },
  async create(channel) {
    const res = await backend.post("/channels", channel);
    return res.data;
  },
  async update(id, channel) {
    const res = await backend.put(`/channels/${id}`, channel);
    return res.data;
  },
  async remove(id) {
    const res = await backend.delete(`/channels/${id}`);
    return res.data;
  },
};

export default channelService; 