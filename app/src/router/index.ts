import { useAuthStore } from "../stores/auth";
import { createWebHistory, createRouter } from "vue-router";

import Login from "../components/Login.vue";
import HomeView from "../components/HomeView.vue";
import Register from "../components/Register.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/home", component: HomeView, meta: { requiresAuth: true } },
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
