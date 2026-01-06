import api from "../api/axios";

export const auditLogsService = {
  /**
   * Get user audit logs (admin only)
   * @param {number} userId
   */
  getUserLogs: async (userId) => {
    const response = await api.get(`/admin/audit-logs/user/${userId}`);
    return response.data;
  },

  /**
   * Get action logs (admin only)
   * @param {string} action - CREATE, UPDATE, DELETE, VIEW, LOGIN
   */
  getActionLogs: async (action) => {
    const response = await api.get(`/admin/audit-logs/action/${action}`);
    return response.data;
  },

  /**
   * Get entity logs (admin only)
   * @param {string} entityType
   */
  getEntityLogs: async (entityType) => {
    const response = await api.get(`/admin/audit-logs/entity/${entityType}`);
    return response.data;
  },

  /**
   * Get logs by date range (admin only)
   * @param {Object} params - {startDate, endDate}
   */
  getLogsByDateRange: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("startDate", params.startDate);
    queryParams.append("endDate", params.endDate);

    const response = await api.get(
      `/admin/audit-logs/date-range?${queryParams}`
    );
    return response.data;
  },

  /**
   * Get recent user activity (admin only)
   * @param {number} userId
   * @param {number} hoursBack
   */
  getRecentActivity: async (userId, hoursBack = 24) => {
    const response = await api.get(
      `/admin/audit-logs/user/${userId}/recent?hoursBack=${hoursBack}`
    );
    return response.data;
  },
};
