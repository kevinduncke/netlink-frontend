<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SpriteIcon from "./SpriteIcon.vue";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// STYLES
import "../styles/userbutton.css"

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

/* REPEATED */
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
.dash-sidepanel {
  background-color: #ffffff;
  color: #000000;
  overflow-y: auto;
}
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
.bar-new-follows h2,
.search-box h2,
.filters-box h2,
.explore-content h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}


/* COMPONENT STYLES */
.search-box {
  margin-bottom: 2rem;
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
</style>
