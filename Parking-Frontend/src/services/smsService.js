import api from "../api/axios";

export const smsService = {
  /**
   * Send SMS (admin only)
   * @param {Object} data - {phoneNumber, message, type}
   */
  sendSMS: async (data) => {
    const response = await api.post("/sms/send", data);
    return response.data;
  },

  /**
   * Send booking confirmation SMS (admin only)
   * @param {Object} params - {phoneNumber, bookingId, slotNumber}
   */
  sendBookingConfirmationSMS: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("phoneNumber", params.phoneNumber);
    queryParams.append("bookingId", params.bookingId);
    queryParams.append("slotNumber", params.slotNumber);

    const response = await api.post(
      `/sms/booking-confirmation?${queryParams}`
    );
    return response.data;
  },

  /**
   * Send payment alert SMS (admin only)
   * @param {Object} params - {phoneNumber, amount}
   */
  sendPaymentAlertSMS: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("phoneNumber", params.phoneNumber);
    queryParams.append("amount", params.amount);

    const response = await api.post(`/sms/payment-alert?${queryParams}`);
    return response.data;
  },

  /**
   * Send parking reminder SMS (admin only)
   * @param {Object} params - {phoneNumber, duration}
   */
  sendParkingReminderSMS: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("phoneNumber", params.phoneNumber);
    queryParams.append("duration", params.duration);

    const response = await api.post(`/sms/parking-reminder?${queryParams}`);
    return response.data;
  },
};
