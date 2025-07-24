import backend from "@/lib/backend_service";

const authService = {
    login: async (emailOrUsername, password) => {
        const payload = {};
        if (emailOrUsername.includes('@')) {
            payload.email = emailOrUsername;
        } else {
            payload.username = emailOrUsername;
        }
        payload.password = password;

        try {
            const response = await backend.post('/auth/login', payload);
            return response.data; // Mengembalikan data dari backend
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    },
};

export default authService; 