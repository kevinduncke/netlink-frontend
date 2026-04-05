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
import Create from "../components/Create.vue";
import Explore from "../components/Explore.vue";
import Connections from "../components/Connections.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HomeView,
    name: "home",
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    component: Login,
    name: "login",
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    component: Register,
    name: "register",
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot",
    component: Forgot,
    name: "forgot-password",
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "dashboard",
    meta: { requiresAuth: true },
  },
  {
    path: "/explore",
    component: Explore,
    name: "explore",
    meta: { requiresAuth: false },
  },
  {
    path: "/connections",
    component: Connections,
    name: "connections",
    meta: { requiresAuth: false },
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
    meta: { requiresAuth: false },
  },
  {
    path: "/create",
    component: Create,
    name: "create-post",
    meta: { requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// NAVIGATION GUARD TO CHECK AUTHENTICATION
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta?.requiresAuth && !auth.token) {
    next("/login");
  } else {
    next();
  }
});
