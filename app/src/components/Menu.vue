<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";

// STYLES
import "../styles/navigation-layout.css";

// COMPONENTS
import SpriteIcon from "./SpriteIcon.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

function signOut() {
  try {
    authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Error during logout: ", error);
  }
}
</script>

<template>
  <div class="mobile-menu">
    <div class="dash-baselogo">
      <img
        src="../assets/logos/netlink-logo-06.png"
        alt="Netlink Logo"
        width="200px"
      />
    </div>
    <div>
      <div class="dash-mainnav">
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'dashboard' }"
        >
          <router-link to="/dashboard">
            <button class="button">
              <SpriteIcon name="dashboard" size="48" title="Dashboard" />
              <span>Dashboard</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'create-post' }"
        >
          <router-link to="/create">
            <button class="button">
              <SpriteIcon name="create" size="48" title="Create" />
              <span>Create & Post</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'explore' }"
        >
          <router-link to="/explore">
            <button class="button">
              <SpriteIcon name="explore" size="48" title="Explore" />
              <span>Explore</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'connections' }"
        >
          <router-link to="/connections">
            <button class="button">
              <SpriteIcon name="connections" size="48" title="Connections" />
              <span>Connections</span>
            </button>
          </router-link>
        </div>
      </div>
      <div class="dash-lownav">
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'account' }"
        >
          <router-link to="/account">
            <button class="button">
              <SpriteIcon name="profile" size="48" title="Account" />
              <span>Account</span>
            </button>
          </router-link>
        </div>
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'messages' }"
        >
          <router-link to="/messages">
            <button class="button">
              <SpriteIcon
                name="messages"
                size="48"
                color="#FFFFFF"
                title="Messages"
              />
              <span>Messages</span>
            </button>
          </router-link>
        </div>
        <div class="dash-navbtns">
          <button class="button">
            <SpriteIcon
              name="settings"
              size="48"
              color="#FFFFFF"
              title="Settings"
            />
            <span>Settings</span>
          </button>
        </div>
        <div class="dash-navbtns">
          <button class="button">
            <SpriteIcon name="more" size="48" color="#FFFFFF" title="More" />
            <span>More</span>
          </button>
        </div>
        <div class="dash-navbtns">
          <button class="button" @click="signOut">
            <SpriteIcon
              name="logout"
              size="48"
              color="#FFFFFF"
              title="Logout"
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-menu {
  height: 100vh;
}
.mobile-menu .dash-baselogo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
.mobile-menu img {
    width: 250px;
}
.button {
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-primary-dark);
}
.button span {
    font-size: 18px;
}
</style>
