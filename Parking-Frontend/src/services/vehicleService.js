import api from "../api/axios";

/**
 * Vehicle Service
 * Handles vehicle CRUD operations for authenticated users
 */
export const vehicleService = {
  /**
   * Get all vehicles for current user (alias for getMyVehicles)
   */
  getUserVehicles: async () => {
    return vehicleService.getMyVehicles();
  },

  /**
   * Get all vehicles for current user
   * GET /api/vehicles/my
   */
  getMyVehicles: async () => {
    const response = await api.get("/vehicles/my");
    return response.data;
  },

  /**
   * Add a new vehicle
   * POST /api/vehicles
   * @param {Object} data - {vehicleType, registrationNumber, make, model, color, isDefault}
   */
  addVehicle: async (data) => {
    const response = await api.post("/vehicles", data);
    return response.data;
  },

  /**
   * Update existing vehicle
   * PUT /api/vehicles/{id}
   * @param {number} id - Vehicle ID
   * @param {Object} data - {vehicleType, registrationNumber, make, model, color}
   */
  updateVehicle: async (id, data) => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Delete a vehicle
   * DELETE /api/vehicles/{id}
   * @param {number} id - Vehicle ID
   */
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Set a vehicle as default
   * PUT /api/vehicles/{id}/set-default
   * @param {number} id - Vehicle ID
   */
  setDefaultVehicle: async (id) => {
    const response = await api.put(`/vehicles/${id}/set-default`);
    return response.data;
  },
};
