import axios from "axios";

export const TOKEN_KEY = "ridemates.token";

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable (private mode etc.) - session just won't persist */
  }
};

// In development Vite proxies /api, /auth, /register and /logout to the Express server.
// In production Express serves the built client itself, so relative URLs work there too.
// VITE_BACKEND_URL is only needed if you host the client separately from the API.
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach the stored token to every request unless the caller set its own header.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface the server's error message so components can show something useful.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) error.message = serverMessage;
    else if (error.code === "ECONNABORTED") error.message = "The server took too long to respond. Please try again.";
    else if (!error.response) error.message = "Could not reach the server. Please try again.";
    return Promise.reject(error);
  }
);

export default api;
