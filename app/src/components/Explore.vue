<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import Navigation from "./Navigation.vue";
import type { ExplorePost } from "../types/post";
import type { FollowUser } from "../types/users";

const router = useRouter();
const authStore = useAuthStore();

// LOAD POSTS
const allPosts = ref<ExplorePost[]>([]);
async function loadPosts() {
  // CHECK IF USER IS AUTHENTICATED
  if (!authStore.token) {
    router.push("/login");
    return;
  }

  try {
    const response = await api.get("/post/all");
    allPosts.value = response.data?.posts || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}

// SEARCH USERS
// SEARCH FILTERS
const query = ref("");

type SearchFilters = {
  people: "anyone" | "following";
  shared: "all" | "posts";
  fromDate: string | null;
  toDate: string | null;
};

function toUtcStartOfDay(date: string | null): string {
  return date ? `${date}T00:00:00.000Z` : "";
}

function toUtcEndOfDay(date: string | null): string {
  return date ? `${date}T23:59:59.999Z` : "";
}

const filters = ref<SearchFilters>({
  people: "anyone", // "anyone" || "following"
  shared: "all", // "all" | "posts"
  fromDate: null,
  toDate: null,
});

async function searchPost() {
  try {
    if (!query.value.trim()) {
      await loadPosts();
      return;
    }

    const params = new URLSearchParams({
      query: query.value,
    });

    const response = await api.get(`/post/search?${params.toString()}`);
    allPosts.value = response.data.posts || [];
  } catch (error) {
    console.error("Error searching posts: ", error);
  }
}
watch(query, searchPost);

const filteredPosts = computed(() => {
  let posts = allPosts.value;

  // PEOPLE FILTER
  if (filters.value.people === "following") {
    posts = posts.filter((p) => p.author.isFollowedByMe);
  }

  // SHARES FILTER
  if (filters.value.shared === "posts") {
    posts = posts.filter((p) => !p.isShared);
  }

  // DATE FILTERS
  if (filters.value.fromDate) {
    const fromDate = new Date(toUtcStartOfDay(filters.value.fromDate));
    posts = posts.filter((p) => new Date(p.createdAt) >= fromDate);
  }
  if (filters.value.toDate) {
    const toDate = new Date(toUtcEndOfDay(filters.value.toDate));
    posts = posts.filter((p) => new Date(p.createdAt) <= toDate);
  }

  console.log(posts);
  return posts;
});

function resetFilters() {
  filters.value = {
    people: "anyone",
    shared: "all",
    fromDate: null,
    toDate: null,
  };
}

// LOAD USERS
const users = ref<FollowUser[]>([]);
async function loadUsers() {
  try {
    const response = await api.get("/users/suggested");
    users.value = response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}

// FOLLOW USER
async function followUser(userId: string | number) {
  await api.post(`/follow/${userId}`);
  await loadUsers();
}

// LIKE AND UNLIKE POST
async function likePost(postId: number | string) {
  try {
    await api.post(`/post/like/${postId}`);
    await loadPosts();
    console.log("Post liked successfully");
  } catch (error) {
    console.error("Error liking post: ", error);
  }
}
// async function unlikePost(postId: number | string) {
//   try {
//     await api.post(`/post/unlike/${postId}`);
//     await loadPosts();
//     console.log("Post unliked successfully");
//   } catch (error) {
//     console.error("Error unliking post: ", error);
//   }
// }

onMounted(async () => {
  await loadUsers();
  await loadPosts();
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="search-box">
        <h2>Search</h2>
        <div class="search-box-input">
          <input
            type="text"
            name="search"
            class="search-input"
            placeholder="Find somethening new..."
            v-model="query"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#C5C5C5"
          >
            <path
              d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
            />
          </svg>
        </div>
      </div>
      <div class="filters-box">
        <h2>Filters</h2>
        <div class="filter-people">
          <h3>People</h3>
          <div
            class="filter-check"
            :class="{ 'filter-selected': filters.people === 'anyone' }"
          >
            <p>From anyone</p>
            <button type="button" @click="filters.people = 'anyone'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-if="filters.people !== 'anyone'"
              >
                <path
                  d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-else
              >
                <path
                  d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
            </button>
          </div>
          <div
            class="filter-check"
            :class="{ 'filter-selected': filters.people === 'following' }"
          >
            <p>People you follow</p>
            <button type="button" @click="filters.people = 'following'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-if="filters.people !== 'following'"
              >
                <path
                  d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-else
              >
                <path
                  d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="filter-shares">
          <h3>Posts</h3>
          <div
            class="filter-check"
            :class="{ 'filter-selected': filters.shared === 'all' }"
          >
            <p>Shares and Posts</p>
            <button type="button" @click="filters.shared = 'all'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-if="filters.shared !== 'all'"
              >
                <path
                  d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-else
              >
                <path
                  d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
            </button>
          </div>
          <div
            class="filter-check"
            :class="{ 'filter-selected': filters.shared === 'posts' }"
          >
            <p>Only show Posts</p>
            <button type="button" @click="filters.shared = 'posts'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-if="filters.shared !== 'posts'"
              >
                <path
                  d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
                v-else
              >
                <path
                  d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="filter-dates">
          <h3>Dates</h3>
          <div class="filter-check">
            <p>From</p>
            <input
              type="date"
              name="from-date"
              id="from-date"
              v-model="filters.fromDate"
            />
          </div>
          <div class="filter-check">
            <p>To</p>
            <input
              type="date"
              name="to-date"
              id="to-date"
              v-model="filters.toDate"
            />
          </div>
        </div>
        <div class="filter-reset">
          <button type="button" @click="resetFilters()">Reset Filters</button>
        </div>
      </div>
      <div class="bar-new-follows">
        <h2>Who to follow</h2>
        <div
          class="bar-user-box"
          v-if="users.length > 0"
          v-for="user in users"
          :key="user.id || 'ID_NOT_FOUND'"
        >
          <div class="bar-user-info">
            <img
              src="../assets/avatars/40x40.png"
              alt="User Avatar"
              class="bar-user-avatar"
              height="40px"
              width="40px"
            />
            <div class="bar-userdata">
              <h2 class="bar-user-name">
                {{ user.name || "UNKNOWN NAME" }}
              </h2>
              <p class="bar-user-username">
                @{{ user.username || "UNKNOWN USERNAME" }}
              </p>
            </div>
          </div>
          <button class="follow-btn" @click="followUser(user.id)">
            Follow
          </button>
        </div>
        <div v-else class="bar-no-users">
          <p>No user suggestions available.</p>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="explore-content">
        <h2>Explore</h2>
        <div v-for="post in filteredPosts" :key="post.id" class="dash-post">
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
              <span>{{ post._count.likes || 0 }}</span>
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
.search-box {
  margin-bottom: 2rem;
}
.bar-new-follows h2,
.search-box h2,
.filters-box h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.filter-people,
.filter-shares,
.filter-dates {
  margin: 1rem 0;
}
.filter-people h3,
.filter-shares h3,
.filter-dates h3 {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  margin: 0;
}
.filter-check {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}
.filter-check p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  margin: 0;
}
.filter-check button {
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  cursor: pointer;
}
.filter-check input {
  border: none;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
}
.filter-selected svg {
  fill: #006145;
}
.search-box-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
  border-radius: 10px;
}
.search-box-input svg:hover {
  fill: #006145;
  cursor: pointer;
}
.search-input {
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.filter-reset {
  margin: 2rem 0;
}
.filter-reset button {
  background: transparent;
  border: 2px solid #C5C5C5;
  width: 100%;
  padding: 1rem 0;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;  
  font-family: 'Montserrat Medium', sans-serif;
  font-size: 0.8rem;
  color: #616161;
  letter-spacing: 0.03rem;
  cursor: pointer;
}
.filter-reset button:hover {
  border: 2px solid #006145;
  color: #006145;
}
.bar-user-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bar-user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  background-color: #006145;
  color: #ffffff;
  border: 2px solid #006145;
  padding: 0.5rem 2rem;
  border-radius: 1rem;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
}
.bar-user-box button:hover {
  background-color: transparent;
  color: #006145;
  border: 2px solid #006145;
}
.bar-no-users {
  text-align: center;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  padding: 1rem 0;
}

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
.explore-content h2 {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.8rem;
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
.edit-post-modal {
  background-color: #fafafa;
  padding: 1.5rem;
}
.edit-post-modal h2 {
  padding: 0;
  margin: 0;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
}
.edit-post textarea {
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  height: 3rem;
  border: none;
  resize: none;
  outline: none;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  padding: 0.7rem 0;
}
.edit-actions {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}
.edit-actions button {
  border: 1px solid #006145;
  color: #006145;
  background: transparent;
  padding: 0.2rem;
  width: 4rem;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
}
.edit-actions button:first-child {
  color: #626262;
  border: 1px solid #626262;
}
</style>
