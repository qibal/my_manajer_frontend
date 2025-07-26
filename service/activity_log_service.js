import backend from "@/lib/backend_service";
import { toast } from "sonner";

const activityLogService = {
  getAll: async () => {
    try {
      const response = await backend.get("/activity-logs");
      return response.data.data || [];
    } catch (error) {
      toast.error("Gagal mengambil log aktivitas", {
        description: error.response?.data?.message || error.message,
      });
      return null;
    }
  },
};

export default activityLogService;
