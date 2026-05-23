<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Notifications from "./Notifications.vue";
import Post from "./Post.vue";
import SpriteIcon from "./SpriteIcon.vue";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// STYLES
import "../styles/app-layout.css";
import "../styles/dashboard.css";
import "../styles/userbutton.css";
import "../styles/input.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  favoriteUsers,
  suggestedUsers,
  favSearchQuery,
  favStateEdit,
  selectedUserId,

  // FUNCTIONS
  loadFavoriteUsers,
  searchFavoriteUsers,
  addFavoriteUser,
  deleteFavoriteUser,
  removeAllFavoriteUsers,
  loadSuggestedUsers,
  selectedUser,
} = useUserData();

// POST FUNCTIONS
const { loadPosts } = usePosts();

watch(favSearchQuery, (newQuery) => {
  if (newQuery.trim() === "") {
    loadFavoriteUsers();
    loadSuggestedUsers("favorites");
  } else {
    searchFavoriteUsers(newQuery);
  }
});

watch(selectedUserId, async (newUserId) => {
  if (newUserId) {
    await loadPosts(`user/${newUserId}`);
  }
});

onMounted(async () => {
  selectedUserId.value = "";
  await loadFavoriteUsers();
  await loadSuggestedUsers("favorites");
  await loadPosts("following");
});
</script>

<template>
  <div class="app-layout">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-fav-base">
        <div class="fav-head">
          <h2>Favorites</h2>
          <button
            class="button"
            type="button"
            @click="favStateEdit = !favStateEdit"
          >
            <SpriteIcon
              name="list"
              size="22"
              color="#535353"
              title="Toggle favorites"
            />
          </button>
        </div>
        <div class="fav-user-list" v-if="!favStateEdit">
          <div
            class="bar-user-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in favoriteUsers"
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
        <div class="dash-fav-edit" v-else>
          <div class="fav-edit-search">
            <input
              type="search"
              name="search"
              id="fav-search"
              placeholder="Search"
              v-model="favSearchQuery"
            />
            <SpriteIcon
              name="search"
              size="22"
              color="#535353"
              title="Search"
            />
          </div>
          <div class="fav-edit-favorites" v-if="favoriteUsers.length > 0">
            <div class="fav-edit-listhead">
              <p>Users</p>
              <button
                class="button"
                type="button"
                @click="removeAllFavoriteUsers()"
              >
                Remove all
              </button>
            </div>
            <div class="fav-edit-users">
              <div
                class="fav-user"
                v-for="user in favoriteUsers"
                :key="user.id"
              >
                <div class="fav-user-data">
                  <div class="fav-user-icon">
                    <AvatarIcon />
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button
                  class="button"
                  type="button"
                  @click="deleteFavoriteUser(user.id)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div class="fav-add-suggestions">
            <p>Suggestions</p>
            <div class="fav-add-users">
              <div
                class="fav-user"
                v-for="user in suggestedUsers"
                :key="user.id"
              >
                <div class="fav-user-data">
                  <div class="fav-user-icon">
                    <AvatarIcon />
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button
                  class="button"
                  type="button"
                  @click="addFavoriteUser(user.id)"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notifications />
    </div>
    <div class="dash-content">
      <div class="dash-lposts">
        <h2>Lastest Posts</h2>
        <Post />
      </div>
    </div>
  </div>
</template>