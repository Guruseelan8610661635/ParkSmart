import api from "../api/axios";

export const subscriptionService = {
  /**
   * Get user subscription
   */
  getMySubscription: async () => {
    const response = await api.get("/subscription/my");
    return response.data;
  },

  /**
   * Create subscription
   * @param {Object} data - {planType, monthlyAmount, slots}
   */
  createSubscription: async (data) => {
    const params = new URLSearchParams();
    params.append("planType", data.planType);
    params.append("monthlyAmount", data.monthlyAmount);
    params.append("slots", data.slots);

    const response = await api.post(`/subscription/create?${params}`);
    return response.data;
  },

  /**
   * Upgrade subscription
   * @param {Object} data - {planType, monthlyAmount, slots}
   */
  upgradeSubscription: async (data) => {
    const params = new URLSearchParams();
    params.append("planType", data.planType);
    params.append("monthlyAmount", data.monthlyAmount);
    params.append("slots", data.slots);

    const response = await api.put(`/subscription/upgrade?${params}`);
    return response.data;
  },

  /**
   * Check subscription status
   */
  checkSubscription: async () => {
    const response = await api.get("/subscription/check");
    return response.data;
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async () => {
    const response = await api.delete("/subscription/cancel");
    return response.data;
  },
};
