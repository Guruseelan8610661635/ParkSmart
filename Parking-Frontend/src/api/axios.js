import axios from "axios";

// Allow overriding the API host via env to avoid hardcoding localhost/port.
const api = axios.create({
  baseURL:
    (import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8080") + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔐 Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`📡 Request to ${config.method.toUpperCase()} ${config.url} with token`);
  } else {
    console.warn(`⚠️ Request to ${config.method.toUpperCase()} ${config.url} WITHOUT token`);
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only redirect if this is not a POST/PUT/DELETE request (which we want to handle with error notification)
      const isDataModificationRequest = ['POST', 'PUT', 'DELETE'].includes(error.config?.method?.toUpperCase());
      
      if (!isDataModificationRequest) {
        // For GET requests on page load, do a hard redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        window.location.href = "/";
      }
      // For data modification requests, let the error propagate so the component can handle it
    }
    return Promise.reject(error);
  }
);

export default api;
