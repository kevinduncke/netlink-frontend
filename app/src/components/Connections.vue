<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Profile from "./Profile.vue";
import Post from "./Post.vue";
import AvatarIcon from "../assets/icons/avatar-icon.vue";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/profile.css";
import "../styles/utilities.css";
import "../styles/app-layout.css";
import "../styles/connections.css";
import "../styles/userbutton.css";
import "../styles/buttons.css";

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

  // FUNCTIONS
  selectedUser,
  loadFollowingUsers,
  loadFollowersUsers,
  loadUserProfile,
  followUser,
  unfollowUser,
} = useUserData();

// POST FUNCTIONS
const { loadPosts } = usePosts();
onMounted(async () => {
  selectedUserId.value = "";
  await loadFollowingUsers();
});

watch(selectedUserId, async (newUserId) => {
  if (newUserId) {
    await loadUserProfile(newUserId);
    await loadPosts(`user/${newUserId}`);
  }
});
</script>

<template>
  <div class="app-layout">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-follows-box">
        <button
          class="button"
          type="button"
          @click="((followsFilter = 'following'), loadFollowingUsers())"
          :class="{ 'selected-follow': followsFilter === 'following' }"
        >
          Following
        </button>
        <button
          class="button"
          type="button"
          @click="((followsFilter = 'followers'), loadFollowersUsers())"
          :class="{ 'selected-follow': followsFilter === 'followers' }"
        >
          Followers
        </button>
      </div>
      <div v-if="followingUsers.length > 0 || followersUsers.length > 0">
        <div class="following-panel" v-if="followsFilter === 'following'">
          <div
            class="main-follow-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in followingUsers"
            :key="user.id"
          >
            <button class="button" type="button" @click="selectedUser(user.id)">
              <div class="box-user-info">
                <div class="bar-user-avatardata">
                  <AvatarIcon />
                  <div class="bar-userdata">
                    <h2 class="bar-user-name">{{ user.name }}</h2>
                    <p class="bar-user-username">@{{ user.username }}</p>
                  </div>
                </div>
                <div>
                  <button class="unfollow-btn" @click="unfollowUser(user.id)">
                    Unfollow
                  </button>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div class="followers-panel" v-else>
          <div
            class="main-follow-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in followersUsers"
            :key="user.id"
          >
            <button class="button" type="button" @click="selectedUser(user.id)">
              <div class="box-user-info">
                <div class="bar-user-avatardata">
                  <AvatarIcon />
                  <div class="bar-userdata">
                    <h2 class="bar-user-name">{{ user.name }}</h2>
                    <p class="bar-user-username">@{{ user.username }}</p>
                  </div>
                </div>
                <div>
                  <button
                    class="unfollow-btn"
                    v-if="user.isFollowedByMe === false"
                    @click="followUser(user.id)"
                  >
                    Follow
                  </button>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="dash-empty-suggestions" style="height: auto; padding: 5rem 0;" v-else>
        <SpriteIcon
          name="connections"
          size="48"
          color="#535353"
          title="Connections"
        />
        <h2>No suggestions available</h2>
      </div>
    </div>
    <div class="dash-content">
      <div v-if="followingUsers.length > 0 || followersUsers.length > 0">
        <div class="dash-profile">
          <h2>Profile</h2>
          <Profile />
        </div>
        <div
          class="dash-posts"
          v-if="followingUsers.length > 0 || followersUsers.length > 0"
        >
          <h2>Posts</h2>
          <Post />
        </div>
      </div>
      <div class="dash-empty-connections" v-else>
        <SpriteIcon
          name="connections"
          size="64"
          color="#535353"
          title="Connections"
        />
        <h2>No connections yet</h2>
      </div>
    </div>
  </div>
</template>
