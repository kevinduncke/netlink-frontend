<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";

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
  <div class="dash-navside">
    <div class="dash-baselogo">
      <img
        src="../assets/logos/netlink-logo-06.png"
        alt="Netlink Logo"
        width="200px"
      />
    </div>
    <div class="dash-navigation">
      <div class="dash-mainnav">
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'dashboard' }"
        >
          <router-link to="/dashboard">
            <button class="button">
              <SpriteIcon name="dashboard" size="22" title="Dashboard" />
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
              <SpriteIcon name="create" size="22" title="Create" />
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
              <SpriteIcon name="explore" size="22" title="Explore" />
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
              <SpriteIcon name="connections" size="22" title="Connections" />
              <span>Connections</span>
            </button>
          </router-link>
        </div>
      </div>
      <div class="dash-lownav">
        <div
          class="dash-navbtns"
          :class="{ 'dash-navactive': route.name === 'profile' }"
        >
          <router-link to="/profile">
            <button class="button">
              <SpriteIcon name="profile" size="22" title="Profile" />
              <span>Profile</span>
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
                size="24"
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
              size="24"
              color="#FFFFFF"
              title="Settings"
            />
            <span>Settings</span>
          </button>
        </div>
        <div class="dash-navbtns">
          <button class="button">
            <SpriteIcon
              name="more"
              size="24"
              color="#FFFFFF"
              title="More"
            />
            <span>More</span>
          </button>
        </div>
        <div class="dash-navbtns">
          <button class="button" @click="signOut">
            <SpriteIcon
              name="logout"
              size="24"
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

<style lang="css" scoped>
.dash-navside {
  background-color: var(--color-primary);
}
.dash-baselogo {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}
.dash-mainnav {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
}
.dash-navbtns {
  padding: 0.2rem 1rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  margin: 0.3rem 0;
}
.dash-navbtns a {
  text-decoration: none;
}
.dash-navbtns button {
  display: flex;
  justify-content: start;
  align-items: center;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
  color: var(--color-white);
  width: 100%;
}
.dash-navbtns svg {
  margin-right: 1rem;
}
.dash-navactive {
  background-color: var(--color-primary-dark);
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.9rem;
  border: 1px solid transparent !important;
}
.dash-navbtns:hover {
  border: 1px solid #ffffff;
}
.dash-lownav {
  margin-top: 1rem;
}
</style>
