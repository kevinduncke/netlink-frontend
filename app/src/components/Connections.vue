<script setup lang="ts">
// VUE
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

// SERVICES AND STORES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";

// TYPES
import type { FollowUser } from "../types/users";
import type { UserProfile } from "../types/users";

// POSTS COMPOSITION
import {
  usePosts,
} from "../shared/usePosts";

const router = useRouter();
const authStore = useAuthStore();

// FILTER FOLLOW PANEL
const followsFilter = ref<string>("following");

// LOAD FOLLOWING USERS
const followingUsers = ref<FollowUser[]>([]);
async function loadFollowingUsers() {
  try {
    const response = await api.get("/follow/following");
    followingUsers.value = response.data;
    const firstFollowingUser = followingUsers.value[0];
    if (firstFollowingUser) {
      selectedUserId.value = firstFollowingUser.id;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}

// LOAD FOLLOWERS USERS
const followersUsers = ref<FollowUser[]>([]);
async function loadFollowersUsers() {
  try {
    followsFilter.value = "followers";
    const response = await api.get("/follow/followers");
    followersUsers.value = response.data;

    const firstFollowerUser = followersUsers.value[0];
    if (firstFollowerUser) {
      selectedUserId.value = firstFollowerUser.id;
    }
  } catch (error) {
    console.error("Error loading followers users: ", error);
  }
}

// LOAD USER PROFILE INFO
const userProfile = ref<UserProfile>({
  name: "",
  username: "",
  bio: "",
  url: "",
  avatarUrl: "",
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
});

async function loadUserProfile() {
  try {
    const res = await api.get(`/users/${selectedUserId.value}`);
    userProfile.value = res.data;
  } catch (error) {
    console.error("Error loading user profile: ", error);
  }
}

// SELECTION FOR FOLLOWING / FOLLOWERS
const selectedUserId = ref<string | number>("");
function selectedUser(userId: string | number) {
  selectedUserId.value = userId;
  editingComment.openCommentPostId = null;
}

// POST FUNCTIONS
const {
  editingComment,
  loadPosts,
} = usePosts();

watch(selectedUserId, (newUserId) => {
  if (newUserId) {
    loadUserProfile();
    loadPosts(`user/${newUserId}`);
  }
});

onMounted(() => {
  loadFollowingUsers();
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-follows-box">
        <button
          type="button"
          @click="followsFilter = 'following'"
          :class="{ 'selected-follow': followsFilter === 'following' }"
        >
          Following
        </button>
        <button
          type="button"
          @click="loadFollowersUsers()"
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
          <button type="button" @click="selectedUser(user.id)">
            <div class="bar-user-info">
              <img
                src="../assets/avatars/40x40.png"
                alt="User Avatar"
                class="bar-user-avatar"
                height="40px"
                width="40px"
              />
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
          <button type="button" @click="selectedUser(user.id)">
            <div class="bar-user-info">
              <img
                src="../assets/avatars/40x40.png"
                alt="User Avatar"
                class="bar-user-avatar"
                height="40px"
                width="40px"
              />
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
            <img :src="userProfile.avatarUrl" />
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
.dash-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  grid-template-rows: 100vh;
  overflow-y: hidden;
}
.dash-navside,
.dash-sidepanel,
.dash-content {
  padding: 10px 20px;
}

/* PROFILE SIDEPANEL */
.dash-sidepanel {
  background-color: #ffffff;
  color: #000000;
  overflow-y: auto;
}
.dash-follows-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f4f4f4;
  border-radius: 10px;
  margin: 0.5rem 0;
}
.dash-follows-box button {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0;
  border: none;
  background-color: transparent;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
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
  background-color: #006145 !important;
  color: #ffffff;
}
.following-panel,
.followers-panel {
  margin-top: 1rem;
}
.bar-user-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  padding: 0 1rem;
}
.selected {
  border-radius: 10px;
  background-color: #efefef;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
}
.bar-user-info {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}
.bar-userdata h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  margin: 0.5rem 0;
}
.bar-userdata p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  margin: 0.5rem 0;
}
.bar-user-box button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: auto;
}
.bar-user-box button:first-child:hover {
  color: #006145;
}

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}

.dash-profile h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  margin-bottom: 0.5rem;
}
.profile-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 2rem 2rem 2rem;
}
.profile-info h1 {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 1.5rem;
}
.profile-stats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.7rem;
  gap: 1rem;
}
.profile-titles p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  line-height: 1rem;
}
.profile-avatar {
  background-color: #e8e8e8;
  height: 125px;
  width: 125px;
  border-radius: 100px;
}

.dash-posts h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  margin-bottom: 2rem;
}
.dash-post {
  background-color: #ffffff;
  padding: 0.8rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.dash-user-post {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dash-username {
  display: inherit;
  justify-content: start;
  align-items: center;
}
.dash-post-opts {
  position: relative;
  display: inherit;
  justify-content: end;
  align-items: center;
}
.dash-post-opts button {
  background: transparent;
  border: none;
  display: inherit;
  padding: 0;
  cursor: pointer;
}
.dash-post-opts button svg {
  margin: 0;
}
.dash-pop-delete {
  position: absolute;
  top: -15px;
  width: 100px;
  border-radius: 10px;
  background-color: #ffffff;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #d6d6d6;
  margin: 2rem 0 0 0;
}
.dash-pop-delete button {
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  padding: 0.3rem;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}
.dash-pop-delete button:hover {
  background-color: #eeeeee;
}
.dash-user-post svg {
  height: 18px;
  width: 18px;
  margin-right: 0.5rem;
  fill: #006145;
}
.dash-user-post span {
  font-family: "Montserrat SemiBold", sans-serif;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
}
.dash-user-post span a {
  text-decoration: none;
  color: #006145;
}
.dash-content-post {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  padding: 0.5rem;
}
.dash-options-post {
  display: flex;
  flex-direction: row;
}
.dash-options-post button {
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 0.5rem;
  cursor: pointer;
}
.dash-options-post svg {
  height: 14px;
  width: 14px;
  margin-right: 0.3rem;
  fill: #535353;
}
.dash-options-post span {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.7rem;
}
.dash-liked svg {
  fill: #c31010;
}
.dash-liked span {
  color: #c31010;
  font-family: "Montserrat Medium", sans-serif;
}
.dash-shared svg {
  fill: #005261;
}
.dash-commented svg {
  fill: #006145;
}

.dash-username-comment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}
.dash-username-comment svg {
  margin-right: 0.5rem;
  fill: #006145;
}
.dash-username-comment span a {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.75rem;
  color: #006145;
  text-decoration: none;
}

.dash-usercmt-info {
  display: flex;
  align-items: center;
}
.dash-username-comment button {
  background: none;
  display: flex;
  border: none;
  outline: none;
  padding: 0;
  cursor: pointer;
}
.dash-username-comment button > svg {
  margin: 0;
}

.dash-comments-post,
.dash-new-comment-post {
  margin: 1.5rem 2rem 1rem 2rem;
  border-top: 2px solid #f9f9f9;
}
.dash-new-comment-post {
  padding-top: 0.5rem;
  display: flex;
  align-items: center;
}
.dash-comments-post,
.dash-new-comment-post {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.75rem;
}
.dash-new-comment-post input {
  box-sizing: border-box;
  width: 100%;
  border: none;
  outline: none;
  background: none;
}
.dash-new-comment-post button {
  background: none;
  border: none;
  outline: none;
  color: #006145;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
}
.dash-usercmt-actions svg {
  fill: #535353;
}
.dash-usercmt-actions button:hover > svg {
  fill: #006145;
}
.dash-comments-post div > p:nth-child(3) {
  font-size: 0.65rem;
}

.dash-usercmt-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.dash-edit-comment input {
  width: 100%;
  box-sizing: border-box;
  margin: 1rem 0;
  border: none;
  outline: none;
  background: none;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.75rem;
}
.dash-edit-comment button {
  background: none;
  border: none;
  outline: none;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
  color: #006145;
  padding: 0;
  padding-right: 1rem;
  cursor: pointer;
}
.dash-edit-comment button:nth-child(2) {
  color: #535353;
}
</style>
