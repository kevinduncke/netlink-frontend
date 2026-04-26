<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SpriteIcon from "./SpriteIcon.vue";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// POSTS | USERDATA
import { usePosts } from "../shared/usePosts";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

const {
  // VARIABLES
  suggestedUsers,
  searchFilters,

  // FUNCTIONS
  loadSuggestedUsers,
  searchPost,
  resetFilters,
  followUser,
} = useUserData();

// POSTS
const {
  // FUNCTIONS
  loadPosts,
} = usePosts();

// SEARCH USERS | SEARCH FILTERS
watch(searchFilters, searchPost, { deep: true });

onMounted(async () => {
  await loadSuggestedUsers("users");
  await loadPosts("all");
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
            v-model="searchFilters.query"
          />
          <SpriteIcon name="search" size="20" color="#006145" title="Add mention" />
        </div>
      </div>
      <div class="filters-box">
        <h2>Filters</h2>
        <div class="filter-people">
          <h3>People</h3>
          <div
            class="filter-check"
            :class="{ 'filter-selected': searchFilters.people === 'anyone' }"
          >
            <p>From anyone</p>
            <button type="button" @click="searchFilters.people = 'anyone'">
              <SpriteIcon
                :name="searchFilters.people !== 'anyone' ? 'circle' : 'checked-circle'"
                size="24"
                :color="searchFilters.people !== 'anyone' ? '#C5C5C5' : '#006145'"
                title="From anyone"
              />
            </button>
          </div>
          <div
            class="filter-check"
            :class="{ 'filter-selected': searchFilters.people === 'following' }"
          >
            <p>People you follow</p>
            <button type="button" @click="searchFilters.people = 'following'">
              <SpriteIcon
                :name="searchFilters.people !== 'following' ? 'circle' : 'checked-circle'"
                size="24"
                :color="searchFilters.people !== 'following' ? '#C5C5C5' : '#006145'"
                title="People you follow"
              />
            </button>
          </div>
        </div>
        <div class="filter-shares">
          <h3>Posts</h3>
          <div
            class="filter-check"
            :class="{ 'filter-selected': searchFilters.shared === 'all' }"
          >
            <p>Shares and Posts</p>
            <button type="button" @click="searchFilters.shared = 'all'">
              <SpriteIcon
                :name="searchFilters.shared !== 'all' ? 'circle' : 'checked-circle'"
                size="24"
                :color="searchFilters.shared !== 'all' ? '#C5C5C5' : '#006145'"
                title="Shares and posts"
              />
            </button>
          </div>
          <div
            class="filter-check"
            :class="{ 'filter-selected': searchFilters.shared === 'posts' }"
          >
            <p style="color: #770500">Only show Posts</p>
            <button type="button" @click="searchFilters.shared = 'posts'">
              <SpriteIcon
                :name="searchFilters.shared !== 'posts' ? 'circle' : 'checked-circle'"
                size="24"
                :color="searchFilters.shared !== 'posts' ? '#770500' : '#006145'"
                title="Only show posts"
              />
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
              v-model="searchFilters.fromDate"
            />
          </div>
          <div class="filter-check">
            <p>To</p>
            <input
              type="date"
              name="to-date"
              id="to-date"
              v-model="searchFilters.toDate"
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
          v-if="suggestedUsers.length > 0"
          v-for="user in suggestedUsers"
          :key="user.id || 'ID_NOT_FOUND'"
        >
          <div class="bar-user-info">
            <AvatarIcon />
            <div class="bar-userdata">
              <h2 class="bar-user-name">
                {{ user.name }}
              </h2>
              <p class="bar-user-username">@{{ user.username }}</p>
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
  border: 2px solid #c5c5c5;
  width: 100%;
  padding: 1rem 0;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
  font-family: "Montserrat Medium", sans-serif;
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
  display: flex;
  justify-content: start;
  align-items: center;
}
.dash-post-opts {
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
}
.dash-post-opts button {
  background: transparent;
  border: none;
  display: flex;
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
