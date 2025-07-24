import backend from "@/lib/backend_service";

const userService = {
  getUsers: async () => {
    try {
      const response = await backend.get('/users');
      return response.data.data; // Sesuaikan dengan struktur respons API Anda
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },
  createUser: async (userData) => {
    try {
      const response = await backend.post('/users', userData);
      return response.data.data; // Sesuaikan dengan struktur respons API Anda
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create user';
    }
  },
  updateUser: async (id, userData) => {
    try {
      const response = await backend.put(`/users/${id}`, userData);
      return response.data.data; // Sesuaikan dengan struktur respons API Anda
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user';
    }
  },
  deleteUser: async (id) => {
    try {
      await backend.delete(`/users/${id}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  },
};

export default userService; 