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

// Automatically attach JWT
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
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // Emit a detailed auth:error event so app can decide what to do (no automatic logout)
      const info = {
        status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        data: error.response?.data || null,
      };
      console.error('🚨 Auth error intercepted:', info);

      try {
        window.dispatchEvent(new CustomEvent('auth:error', { detail: info }));
      } catch (e) {
        // ignore in non-browser envs
      }

      // Keep previous conservative behavior: do not auto-clear storage or redirect here.
      // Let the calling code handle UI/redirect while having more context via event.
      console.warn('⚠️ API Auth error (401/403). Letting the caller handle it:', info);
    }
    return Promise.reject(error);
  }
);

export default api;
