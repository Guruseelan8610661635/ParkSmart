import api from "../api/axios";

export const statisticsService = {
  /**
   * Get occupancy statistics for a location
   * @param {number} locationId
   * @param {Object} options - {startDate, endDate, granularity}
   */
  getOccupancyStatistics: async (locationId, options = {}) => {
    const params = new URLSearchParams();
    if (options.startDate) params.append("startDate", options.startDate);
    if (options.endDate) params.append("endDate", options.endDate);
    if (options.granularity) params.append("granularity", options.granularity);

    const response = await api.get(
      `/statistics/occupancy/location/${locationId}?${params}`
    );
    return response.data;
  },

  /**
   * Get hourly trends
   * @param {number} locationId
   * @param {Object} options - {startDate, endDate}
   */
  getHourlyTrends: async (locationId, options = {}) => {
    const params = new URLSearchParams();
    if (options.startDate) params.append("startDate", options.startDate);
    if (options.endDate) params.append("endDate", options.endDate);

    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/hourly?${params}`
    );
    return response.data;
  },

  /**
   * Get daily trends
   * @param {number} locationId
   * @param {Object} options - {startDate, endDate}
   */
  getDailyTrends: async (locationId, options = {}) => {
    const params = new URLSearchParams();
    if (options.startDate) params.append("startDate", options.startDate);
    if (options.endDate) params.append("endDate", options.endDate);

    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/daily?${params}`
    );
    return response.data;
  },

  /**
   * Get weekly trends
   * @param {number} locationId
   * @param {Object} options - {startDate, endDate}
   */
  getWeeklyTrends: async (locationId, options = {}) => {
    const params = new URLSearchParams();
    if (options.startDate) params.append("startDate", options.startDate);
    if (options.endDate) params.append("endDate", options.endDate);

    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/weekly?${params}`
    );
    return response.data;
  },

  /**
   * Get monthly trends
   * @param {number} locationId
   * @param {Object} options - {startDate, endDate}
   */
  getMonthlyTrends: async (locationId, options = {}) => {
    const params = new URLSearchParams();
    if (options.startDate) params.append("startDate", options.startDate);
    if (options.endDate) params.append("endDate", options.endDate);

    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/monthly?${params}`
    );
    return response.data;
  },

  /**
   * Get peak hours
   * @param {number} locationId
   */
  getPeakHours: async (locationId) => {
    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/peak-hours`
    );
    return response.data;
  },

  /**
   * Get usage trends
   * @param {number} locationId
   * @param {Object} options - {startDate, endDate}
   */
  getUsageTrends: async (locationId, options = {}) => {
    const params = new URLSearchParams();
    if (options.startDate) params.append("startDate", options.startDate);
    if (options.endDate) params.append("endDate", options.endDate);

    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/usage-trends?${params}`
    );
    return response.data;
  },

  /**
   * Get quick occupancy snapshot
   * @param {number} locationId
   */
  getOccupancySnapshot: async (locationId) => {
    const response = await api.get(
      `/statistics/occupancy/location/${locationId}/quick`
    );
    return response.data;
  },
};
