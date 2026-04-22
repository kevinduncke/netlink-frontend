<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";

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
    loadSuggestedUsers();
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
  await loadFavoriteUsers();
  await loadSuggestedUsers();
  await loadPosts("following");
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-fav-base">
        <div class="fav-head">
          <h2>Favorites</h2>
          <button type="button" @click="favStateEdit = !favStateEdit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#e3e3e3"
            >
              <path
                d="M288-600v-72h528v72H288Zm0 156v-72h528v72H288Zm0 156v-72h528v72H288ZM180-600q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-636q0 14-10.35 25T180-600Zm0 156q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-480q0 14-10.35 25T180-444Zm0 156q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-324q0 14-10.35 25T180-288Z"
              />
            </svg>
          </button>
        </div>
        <div class="fav-user-list" v-if="!favStateEdit">
          <div
            class="bar-user-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in favoriteUsers"
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
        <div class="dash-fav-edit" v-else>
          <div class="fav-edit-search">
            <input
              type="search"
              name="search"
              id="fav-search"
              placeholder="Search"
              v-model="favSearchQuery"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#e3e3e3"
            >
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
              />
            </svg>
          </div>
          <div class="fav-edit-favorites" v-if="favoriteUsers.length > 0">
            <div class="fav-edit-listhead">
              <p>Users</p>
              <button type="button" @click="removeAllFavoriteUsers()">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"
                      />
                    </svg>
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button type="button" @click="deleteFavoriteUser(user.id)">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"
                      />
                    </svg>
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button type="button" @click="addFavoriteUser(user.id)">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-lposts">
        <h2>Lastest Posts</h2>
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

.fav-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.fav-head h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.fav-head button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
.fav-head button:hover svg {
  fill: #006145;
}

.fav-head-post {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
}
.fav-head-post p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  margin: 0.2rem !important;
}

.fav-users {
  background-color: #fbfbfb;
  padding: 0.8rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.fav-users p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  margin: 1rem 0;
}

.fav-foot-post {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.fav-foot-post button {
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
.fav-foot-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.fav-foot-actions button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.3rem;
}
.fav-foot-actions span {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.7rem;
}
.fav-foot-actions button:nth-child(1):hover svg {
  fill: #006145;
}
.fav-foot-actions button:nth-child(2):hover svg {
  fill: #c31010;
}
.fav-foot-actions button:nth-child(3):hover svg {
  fill: #005261;
}

.fav-liked svg {
  fill: #c31010;
}
.fav-shared svg {
  fill: #005261;
}
.fav-commented svg {
  fill: #006145;
}

.fav-edit-search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fbfbfb;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  border-radius: 10px;
}
.fav-edit-search input {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  color: #535353;
}

.fav-edit-listhead {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}
.fav-edit-listhead p,
.fav-add-suggestions p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}
.fav-edit-listhead button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: #005261;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}

.fav-edit-users,
.fav-add-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.fav-user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.fav-user button {
  background: #f1f1f1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
}
.fav-user button:hover {
  background: #e9e9e9;
}
.fav-user-data {
  display: inherit;
  align-items: center;
  gap: 0.5rem;
}
.fav-user-names p {
  margin: 0.3rem !important;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}

.fav-add-suggestions {
  margin-top: 2rem;
  overflow-y: auto;
}

.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
.dash-lposts h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
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
  margin: 1.5rem 2rem 1rem 1rem;
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
</style>
