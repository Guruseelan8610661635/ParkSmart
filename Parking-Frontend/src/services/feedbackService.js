import api from "../api/axios";

export const feedbackService = {
  /**
   * Submit feedback
   * @param {Object} data - {rating, comment, category}
   */
  submitFeedback: async (data) => {
    const response = await api.post("/feedback", data);
    return response.data;
  },

  /**
   * Get user feedback
   */
  getUserFeedback: async () => {
    const response = await api.get("/feedback/my");
    return response.data;
  },

  /**
   * Get feedback statistics
   */
  getFeedbackStats: async () => {
    const response = await api.get("/feedback/stats");
    return response.data;
  },
};
