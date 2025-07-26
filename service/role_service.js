import backend from "@/lib/backend_service";

const roleService = {
  async getAll() {
    try {
      const response = await backend.get('/roles');
      // Always return the full response object
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error.response?.data?.message || 'Failed to fetch roles';
    }
  },
  async getById(id) {
    try {
        const response = await backend.get(`/roles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching role ${id}:`, error);
        throw error.response?.data?.message || 'Failed to fetch role by ID';
    }
  },
  async create(roleData) {
    try {
        const response = await backend.post('/roles', roleData);
        return response.data;
    } catch (error) {
        console.error("Error creating role:", error);
        throw error.response?.data?.message || 'Failed to create role';
    }
  },
  async update(id, roleData) {
    try {
        const response = await backend.put(`/roles/${id}`, roleData);
        return response.data;
    } catch (error) {
        console.error(`Error updating role ${id}:`, error);
        throw error.response?.data?.message || 'Failed to update role';
    }
  },
  async remove(id) {
    try {
        const response = await backend.delete(`/roles/${id}`);
        return response.data;
    } catch (error)
    {
        console.error(`Error deleting role ${id}:`, error);
        throw error.response?.data?.message || 'Failed to delete role';
    }
  },
};

export default roleService; 