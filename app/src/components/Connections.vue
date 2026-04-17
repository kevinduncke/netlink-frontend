<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import Navigation from "./Navigation.vue";
import type { FollowUser } from "../types/users";
import type { ExplorePost } from "../types/post";
import type { UserProfile } from "../types/users";

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
    name: '',
    username: '',
    bio: '',
    url: '',
    avatarUrl: '',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0    
});

async function loadUserProfile(){
    try {
        const res = await api.get(`/users/${selectedUserId.value}`);
        userProfile.value = res.data;
    } catch (error) {
        console.error("Error loading user profile: ", error);
    }
}

// SELECTION FOR FOLLOWING / FOLLOWERS USERS
const selectedUserId = ref<string | number>("");
function selectedUser(userId: string | number) {
  selectedUserId.value = userId;
}

// LOAD POSTS OF SELECTED USER
const userPosts = ref<ExplorePost[]>([]);
async function loadUserPosts(userId: string | number) {
  try {
    const response = await api.get(`/post/user/${userId}`);
    userPosts.value = response.data.posts;
  } catch (error) {
    console.error("Error loading user posts: ", error);
  }
}

// LIKE AND UNLIKE POST
async function likePost(postId: number | string) {
  try {
    await api.post(`/post/like/${postId}`);
    await loadUserPosts(selectedUserId.value);
  } catch (error) {
    console.error("Error liking post: ", error);
  }
}

// async function unlikePost(postId: number | string) {
//   try {
//     await api.post(`/post/unlike/${postId}`);
//     await loadUserPosts(selectedUserId.value);
//     console.log("Post unliked successfully");
//   } catch (error) {
//     console.error("Error unliking post: ", error);
//   }
// }

watch(selectedUserId, (newUserId) => {
  if (newUserId) {
    loadUserProfile();
    loadUserPosts(newUserId);
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
        <div v-for="post in userPosts" :key="post.id" class="dash-post">
          <div class="dash-user-post">
            <div class="dash-username">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
                />
              </svg>
              <span>
                <RouterLink :to="`/profile/${post.author.name}`">{{
                  post.author.name
                }}</RouterLink>
              </span>
            </div>
          </div>
          <div class="dash-content-post">
            <p>{{ post.content }}</p>
          </div>
          <div class="dash-options-post">
            <button
              type="button"
              :class="{ 'dash-commented': post._count.comments }"
              v-if="!post.disableComments"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M440-400h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"
                />
              </svg>
              <span>{{ post._count.comments || 0 }}</span>
            </button>
            <button
              type="button"
              @click="likePost(post.id)"
              :class="{ 'dash-liked': post._count.likes }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
                />
              </svg>
              <span v-if="!post.hideLikes">{{ post._count.likes || 0 }}</span>
            </button>
            <button
              type="button"
              :class="{ 'dash-shared': post._count.shares }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"
                />
              </svg>
              <span>{{ post._count.shares || 0 }}</span>
            </button>
          </div>
        </div>
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
</style>
