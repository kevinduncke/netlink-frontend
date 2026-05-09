<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Profile from "./Profile.vue";
import Post from "./Post.vue";

// STYLES
import "../styles/profile.css";
import "../styles/utilities.css";
import "../styles/body.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  selectedUserId,

  resetUserProfile,
  loadUserProfile,
} = useUserData();

// POST FUNCTIONS
const { loadPosts } = usePosts();

async function loadSelectedUser(userId: string | number) {
  if (!userId) {
    return;
  }

  resetUserProfile();
  await loadUserProfile(userId);
  await loadPosts(`user/${userId}`);
}

onMounted(async () => {
  await loadSelectedUser(selectedUserId.value);
});

watch(selectedUserId, async (newUserId) => {
  if (newUserId) {
    await loadSelectedUser(newUserId);
  }
});

onBeforeRouteLeave((to) => {
  // Only clear selectedUserId if leaving /user route entirely
  if (!to.path.startsWith("/user/")) {
    selectedUserId.value = "";
    resetUserProfile();
  }
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel"></div>
    <div class="dash-content">
      <div class="profile-content">
        <h2>Profile</h2>
        <Profile />
      </div>
      <div class="posts-content">
        <h2>Posts</h2>
        <Post />
      </div>
    </div>
  </div>
</template>
