import api from "../api/axios";

export const pricingService = {
  /**
   * Get all pricing tiers (admin only)
   */
  getAllPricing: async () => {
    const response = await api.get("/admin/pricing");
    return response.data;
  },

  /**
   * Get pricing for vehicle type (public)
   * @param {string} vehicleType
   */
  getPricingByType: async (vehicleType) => {
    const response = await api.get(`/pricing/rates/${vehicleType}`);
    return response.data;
  },

  /**
   * Create pricing tier (admin only)
   * @param {Object} data - {vehicleType, hourlyRate, dailyRate, monthlyRate}
   */
  createPricing: async (data) => {
    const response = await api.post("/admin/pricing", data);
    return response.data;
  },

  /**
   * Update pricing (admin only)
   * @param {string} vehicleType
   * @param {Object} data - {hourlyRate, dailyRate, monthlyRate}
   */
  updatePricing: async (vehicleType, data) => {
    const response = await api.put(`/admin/pricing/${vehicleType}`, data);
    return response.data;
  },

  /**
   * Delete pricing tier (admin only)
   * @param {string} vehicleType
   */
  deletePricing: async (vehicleType) => {
    const response = await api.delete(`/admin/pricing/${vehicleType}`);
    return response.data;
  },
};
