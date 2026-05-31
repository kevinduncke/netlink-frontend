<script setup lang="ts">
// VUE
import { computed, onMounted, onBeforeUnmount, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SpriteIcon from "./SpriteIcon.vue";
import SkeletonUserRow from "./states/SkeletonUserRow.vue";
import SkeletonPost from "./states/SkeletonPost.vue";
import ErrorState from "./states/ErrorState.vue";
import EmptyState from "./states/EmptyState.vue";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// STYLES
import "../styles/userbutton.css";
import "../styles/buttons.css";
import "../styles/app-layout.css";
import "../styles/explore.css";
import "../styles/input.css";

// POSTS | USERDATA
import { usePosts } from "../shared/usePosts";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

const {
  // VARIABLES
  suggestedUsers,
  loadingSuggestedUsers,
  suggestedUsersError,
  searchFilters,
  loadingSearchPosts,
  searchPostsError,

  // FUNCTIONS
  loadSuggestedUsers,
  searchPost,
  resetFilters,
  followUser,
  selectedUser,
  getUserRoute,
} = useUserData();

// POSTS
const {
  userdata,
  loadingPosts,
  postsError,

  // FUNCTIONS
  loadPosts,
} = usePosts();

const hasActiveSearch = computed(() => {
  return (
    searchFilters.query.trim() !== "" ||
    searchFilters.people !== "anyone" ||
    searchFilters.shared !== "all" ||
    searchFilters.fromDate !== "" ||
    searchFilters.toDate !== ""
  );
});

const currentPostsError = computed(() =>
  hasActiveSearch.value ? searchPostsError.value : postsError.value,
);

async function refreshExplorePosts() {
  if (hasActiveSearch.value) {
    await searchPost();
    return;
  }

  await loadPosts("all");
}

async function refreshSuggestedUsers() {
  await loadSuggestedUsers("users");
}

onMounted(async () => {
  await loadSuggestedUsers("users");
  await loadPosts("all");
});

let searchPostTimer: ReturnType<typeof window.setTimeout> | null = null;

watch(
  searchFilters,
  () => {
    if (searchPostTimer) {
      window.clearTimeout(searchPostTimer);
    }

    searchPostTimer = window.setTimeout(() => {
      searchPost();
    }, 300);
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (searchPostTimer) {
    window.clearTimeout(searchPostTimer);
  }
});
</script>

<template>
  <div class="app-layout">
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
        <SkeletonUserRow v-if="loadingSuggestedUsers" :count="4" />
        <ErrorState
          v-else-if="suggestedUsersError"
          :message="suggestedUsersError"
          @retry="refreshSuggestedUsers"
        />
        <div
          v-else-if="suggestedUsers.length > 0"
          class="main-follow-box"
          v-for="user in suggestedUsers"
          :key="user.id || 'ID_NOT_FOUND'"
        >
          <div class="box-user-info">
            <RouterLink
              :to="getUserRoute(user.username, user.id)"
              @click="selectedUser(user.id)"
            >
              <div class="bar-user-avatardata">
                <AvatarIcon />
                <div class="bar-userdata">
                  <h2 class="bar-user-name">{{ user.name }}</h2>
                  <p class="bar-user-username">@{{ user.username }}</p>
                </div>
              </div>
            </RouterLink>
            <div>
              <button class="follow-btn button" @click="followUser(user.id)">
                Follow
              </button>
            </div>
          </div>
        </div>
        <EmptyState
          v-else
          title="No suggestions available"
          message="Follow a few people to improve your recommendations."
          icon="connections"
        />
      </div>
    </div>
    <div class="dash-content">
      <div class="explore-content">
        <h2>Explore</h2>
        <SkeletonPost v-if="loadingPosts || loadingSearchPosts" />
        <ErrorState
          v-else-if="currentPostsError"
          :message="currentPostsError"
          @retry="refreshExplorePosts"
        />
        <Post v-else-if="userdata.length > 0" />
        <EmptyState
          v-else-if="hasActiveSearch"
          title="No results found"
          message="Try a different search or loosen the filters."
          icon="search"
        />
        <EmptyState
          v-else
          title="No posts yet"
          message="Follow a user to see their posts."
          icon="connections"
        />
      </div>
    </div>
  </div>
</template>
