import { useAuthStore } from "../stores/auth";
import { createWebHistory, createRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import Login from "../components/Login.vue";
import HomeView from "../components/HomeView.vue";
import Register from "../components/Register.vue";
import Forgot from "../components/Forgot.vue";
import Dashboard from "../components/Dashboard.vue";
import Profile from "../components/Profile.vue";
import PageNotFound from "../components/404.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: HomeView, name: "home" },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  { path: "/forgot", component: Forgot, name: "forgot-password" },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "dashboard",
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: Profile,
    name: "profile",
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: PageNotFound,
    name: "page-not-found",
  },
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
