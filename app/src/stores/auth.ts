import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: (() => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;

      try {
        return JSON.parse(rawUser) as {
          id?: number | string;
          [key: string]: unknown;
        };
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    })(),
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });
      this.token = res.data.accessToken;
      this.user = res.data.user;

      if (this.token) {
        localStorage.setItem("token", this.token);
      }

      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    async register(email: string, name: string, password: string) {
      await api.post("/auth/register", { email, name, password });
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    isAuthenticated() {
      if (this.token && this.user){
        return true;
      } else {
        return false;
      }
    }
  },
});
