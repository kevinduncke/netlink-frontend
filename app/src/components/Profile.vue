<script setup lang="ts">
// VUE
import { watch } from "vue";

// COMPONENTS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// STYLES
import "../styles/profile.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  userProfile,
} = useUserData();

watch(
  () => [
    userProfile.value.name,
    userProfile.value.username,
    userProfile.value.bio,
    userProfile.value.url,
    userProfile.value.avatarUrl,
  ],
  () => {},
  { immediate: true },
);
</script>

<template>
  <div class="profile-head" v-if="userProfile">
    <div class="profile-info">
      <h1>{{ userProfile.name }}</h1>
      <h2>@{{ userProfile.username }}</h2>
      <div class="profile-stats">
        <div>
          <p>{{ userProfile.postsCount }} Posts</p>
        </div>
        <div>
          <p>{{ userProfile.followersCount }} Followers</p>
        </div>
        <div>
          <p>{{ userProfile.followingCount }} Following</p>
        </div>
      </div>
      <div class="profile-titles">
        <p>{{ userProfile.bio }}</p>
      </div>
    </div>
    <div class="profile-avatar">
      <AvatarIcon height="125" width="125" />
    </div>
  </div>
</template>
