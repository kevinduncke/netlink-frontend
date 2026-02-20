import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });
      this.token = res.data.accessToken;
      this.user = res.data.user;

      console.log("User logged in: ", this.user);
      console.log("Token: ", this.token);

      if (this.token) {
        localStorage.setItem("token", this.token);
      }
    },

    async register(email: string, password: string) {
      await api.post("/auth/register", { email, password });
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
