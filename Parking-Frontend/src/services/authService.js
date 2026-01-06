import api from "../api/axios";

export const authService = {
  /**
   * Register a new user
   * @param {Object} data - {email, password, name, phone}
   */
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} data - {email, password}
   */
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("role", response.data.role);
      // Store additional fields if present
      if (response.data.phone) {
        localStorage.setItem("phone", response.data.phone);
      }
      if (response.data.expiresIn) {
        localStorage.setItem("tokenExpiresIn", response.data.expiresIn);
      }
    }
    return response.data;
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("phone");
    localStorage.removeItem("tokenExpiresIn");
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Get current user role
   */
  getUserRole: () => {
    return localStorage.getItem("role");
  },

  /**
   * Get current user ID
   */
  getUserId: () => {
    return localStorage.getItem("userId");
  },

  /**
   * Get current user data
   */
  getCurrentUser: () => {
    return {
      userId: localStorage.getItem("userId"),
      email: localStorage.getItem("email"),
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role"),
      phone: localStorage.getItem("phone"),
    };
  },

  /**
   * Admin Login Step 1: Request OTP
   * @param {Object} data - {email, password}
   */
  adminLoginRequestOTP: async (data) => {
    const response = await api.post("/auth/admin/login-request-otp", data);
    return response.data;
  },

  /**
   * Admin Login Step 2: Verify OTP
   * @param {Object} data - {email, otp}
   */
  adminVerifyOTP: async (data) => {
    const response = await api.post("/auth/admin/verify-otp", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("role", response.data.role);
      if (response.data.expiresIn) {
        localStorage.setItem("tokenExpiresIn", response.data.expiresIn);
      }
    }
    return response.data;
  },
};
