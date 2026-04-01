import axios from "axios";

// Update baseURL to point to Spring Boot backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isNgrokTunnel =
  API_URL.includes(".ngrok-free.dev") ||
  API_URL.includes(".ngrok.io") ||
  API_URL.includes(".ngrok.app");

if (isNgrokTunnel) {
  // Prevent ngrok warning/interstitial page from breaking browser API calls.
  api.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("mentormatch_user");
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global API errors (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("mentormatch_user");
      // Only redirect if we are not already on the login page
      const currentPath = window.location.pathname;
      if (
        currentPath !== "/login" &&
        currentPath !== "/auth" &&
        currentPath !== "/register"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
