<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// STYLES
import "../styles/profile.css"
import "../styles/userbutton.css"
import "../styles/body.css"

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  selectedUserId,
  followsFilter,
  followingUsers,
  followersUsers,
  userProfile,

  // FUNCTIONS
  selectedUser,
  loadFollowingUsers,
  loadFollowersUsers,
  loadUserProfile,
} = useUserData();

// POST FUNCTIONS
const { loadPosts } = usePosts();

watch(selectedUserId, (newUserId) => {
  if (newUserId) {
    loadUserProfile(selectedUserId.value);
    loadPosts(`user/${newUserId}`);
  }
});

onMounted(() => {
  selectedUserId.value = "";
  loadFollowingUsers();
  loadUserProfile(selectedUserId.value);
  loadPosts(`user/${selectedUserId.value}`);
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-follows-box">
        <button
          class="button"
          type="button"
          @click="followsFilter = 'following', loadFollowingUsers()"
          :class="{ 'selected-follow': followsFilter === 'following' }"
        >
          Following
        </button>
        <button
          class="button"
          type="button"
          @click="followsFilter = 'followers', loadFollowersUsers()"
          :class="{ 'selected-follow': followsFilter === 'followers' }"
        >
          Followers
        </button>
      </div>
      <div class="following-panel" v-if="followsFilter === 'following'">
        <div
          class="bar-user-box"
          :class="{ selected: selectedUserId === user.id }"
          v-for="user in followingUsers"
          :key="user.id"
        >
          <button class="button" type="button" @click="selectedUser(user.id)">
            <div class="bar-user-info">
              <AvatarIcon />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ user.name }}</h2>
                <p class="bar-user-username">@{{ user.username }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="followers-panel" v-else>
        <div
          class="bar-user-box"
          :class="{ selected: selectedUserId === user.id }"
          v-for="user in followersUsers"
          :key="user.id"
        >
          <button class="button" type="button" @click="selectedUser(user.id)">
            <div class="bar-user-info">
              <AvatarIcon />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ user.name }}</h2>
                <p class="bar-user-username">@{{ user.username }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-profile">
        <h2>Profile</h2>
        <div class="profile-head">
          <div class="profile-info">
            <h1>{{ userProfile.name || "Unknown User" }}</h1>
            <h2>@{{ userProfile.username || "Unknown Username" }}</h2>
            <div class="profile-stats">
              <div>
                <p>{{ userProfile.postsCount || 0 }} Posts</p>
              </div>
              <div>
                <p>{{ userProfile.followersCount || 0 }} Followers</p>
              </div>
              <div>
                <p>{{ userProfile.followingCount || 0 }} Following</p>
              </div>
            </div>
            <div class="profile-titles">
              <p>{{ userProfile.bio || "No bio available." }}</p>
            </div>
          </div>
          <div class="profile-avatar">
          </div>
        </div>
      </div>
      <div class="dash-posts">
        <h2>Posts</h2>
        <Post />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* COMPONENT STYLES */
.dash-follows-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
  margin: var(--spacing-sm) 0;
}
.dash-follows-box button {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
}
.dash-follows-box button:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.dash-follows-box button:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.selected-follow {
  background-color: var(--color-primary) !important;
  color: var(--color-white);
}
.following-panel,
.followers-panel {
  margin-top: 1rem;
}
</style>
