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
import "../styles/userbutton.css";
import "../styles/buttons.css";
import "../styles/body.css";
import "../styles/input.css"

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

onMounted(async () => {
  await loadSuggestedUsers("users");
  await loadPosts("all");
});

// SEARCH USERS | SEARCH FILTERS
watch(searchFilters, searchPost, { deep: true });
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="search-box">
        <h2>Search</h2>
        <div class="search-box-input shadow-light">
          <input
            type="text"
            name="search"
            class="search-input"
            placeholder="Find somethening new..."
            v-model="searchFilters.query"
          />
          <SpriteIcon
            name="search"
            size="20"
            color="#535353"
            title="Add mention"
          />
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
            <button
              class="button"
              type="button"
              @click="searchFilters.people = 'anyone'"
            >
              <SpriteIcon
                :name="
                  searchFilters.people !== 'anyone'
                    ? 'circle'
                    : 'checked-circle'
                "
                size="24"
                color="#535353"
                title="From anyone"
              />
            </button>
          </div>
          <div
            class="filter-check"
            :class="{ 'filter-selected': searchFilters.people === 'following' }"
          >
            <p>People you follow</p>
            <button
              class="button"
              type="button"
              @click="searchFilters.people = 'following'"
            >
              <SpriteIcon
                :name="
                  searchFilters.people !== 'following'
                    ? 'circle'
                    : 'checked-circle'
                "
                size="24"
                color="#535353"
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
            <button
              class="button"
              type="button"
              @click="searchFilters.shared = 'all'"
            >
              <SpriteIcon
                :name="
                  searchFilters.shared !== 'all' ? 'circle' : 'checked-circle'
                "
                size="24"
                color="#535353"
                title="Shares and posts"
              />
            </button>
          </div>
          <div
            class="filter-check"
            :class="{ 'filter-selected': searchFilters.shared === 'posts' }"
          >
            <p>Only show Posts</p>
            <button
              class="button"
              type="button"
              @click="searchFilters.shared = 'posts'"
            >
              <SpriteIcon
                :name="
                  searchFilters.shared !== 'posts' ? 'circle' : 'checked-circle'
                "
                size="24"
                color="#535353"
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
          <button
            class="shadow-light button"
            type="button"
            @click="resetFilters()"
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div class="bar-new-follows">
        <h2>Who to follow</h2>
        <div
          class="main-follow-box"
          v-if="suggestedUsers.length > 0"
          v-for="user in suggestedUsers"
          :key="user.id || 'ID_NOT_FOUND'"
        >
          <div class="box-user-info">
            <div class="bar-user-avatardata">
              <AvatarIcon />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ user.name }}</h2>
                <p class="bar-user-username">@{{ user.username }}</p>
              </div>
            </div>
            <div>
              <button class="follow-btn button" @click="followUser(user.id)">
                Follow
              </button>
            </div>
          </div>
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
  outline: none;
  padding: 0;
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
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  -webkit-box-shadow: var(--shadow-light);
  box-shadow: var(--shadow-light);
}
.search-box-input svg:hover {
  fill: var(--color-primary);
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
  border: 2px solid var(--color-gray-500);
  width: 100%;
  padding: var(--spacing-md) 0;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
  color: var(--color-gray-700);
  letter-spacing: 0.03rem;
}
.filter-reset button:hover {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}
.bar-no-users {
  text-align: center;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  padding: var(--spacing-md) 0;
}
</style>
