import { useAuthStore } from "../stores/auth";
import { createWebHistory, createRouter } from "vue-router";

import Login from "../components/Login.vue";
import HomeView from "../components/HomeView.vue";
import Register from "../components/Register.vue";
import Forgot from "../components/Forgot.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot", component: Forgot },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    next("/login");
  } else {
    next();
  }
});
