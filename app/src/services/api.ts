import axios from "axios";

const defaultPort = 4400;
const envUrl = import.meta.env.VITE_API_URL;
const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";
const apiBase = envUrl || `${protocol}//${hostname}:${defaultPort}`;
console.log("API Base URL:", apiBase);
const api = axios.create({
  baseURL: apiBase,
});

// INJECT TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
