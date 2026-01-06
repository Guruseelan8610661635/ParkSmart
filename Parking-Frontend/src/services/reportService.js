import api from "../api/axios";

export const reportService = {
  /**
   * Get daily report (admin only)
   */
  getDailyReport: async () => {
    const response = await api.get("/admin/reports/daily");
    return response.data;
  },

  /**
   * Get weekly report (admin only)
   */
  getWeeklyReport: async () => {
    const response = await api.get("/admin/reports/weekly");
    return response.data;
  },

  /**
   * Get monthly report (admin only)
   */
  getMonthlyReport: async () => {
    const response = await api.get("/admin/reports/monthly");
    return response.data;
  },

  /**
   * Get custom report (admin only)
   * @param {Object} data - {startDate, endDate, reportType, locationId}
   */
  getCustomReport: async (data) => {
    const response = await api.post("/admin/reports/custom", data);
    return response.data;
  },
};
