<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  userProfile,
  originalProfile,
  editingProfile,
  hasUnsavedChanges,

  // FUNCTIONS
  loadMyProfile,
  toggleEdit,
  toggleCloseEdit,
  saveProfile,
  deleteAccount,
} = useUserData();

onMounted(async () => {
  await loadMyProfile();
});
watch(
  () => [
    userProfile.value.name,
    userProfile.value.username,
    userProfile.value.bio,
    userProfile.value.url,
    userProfile.value.avatarUrl,
    originalProfile.value.name,
    originalProfile.value.username,
    originalProfile.value.bio,
    originalProfile.value.url,
    originalProfile.value.avatarUrl,
  ],
  () => {
    hasUnsavedChanges.value =
      (userProfile.value.name ?? "") !== (originalProfile.value.name ?? "") ||
      (userProfile.value.username ?? "") !==
        (originalProfile.value.username ?? "") ||
      (userProfile.value.bio ?? "") !== (originalProfile.value.bio ?? "") ||
      (userProfile.value.url ?? "") !== (originalProfile.value.url ?? "") ||
      (userProfile.value.avatarUrl ?? "") !==
        (originalProfile.value.avatarUrl ?? "");
  },
  { immediate: true },
);
onBeforeRouteLeave(() => {
  if (!hasUnsavedChanges.value) {
    return true;
  }
  const confirmLeave = confirm(
    "You have unsaved changes. Are you sure you want to leave without saving?",
  );
  return confirmLeave;
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="profile-edit">
        <h2>Edit Profile</h2>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label>Name</label>
            <input
              type="text"
              name="name"
              v-model="userProfile.name"
              id="profile-name"
              placeholder="Edit your name."
              :disabled="!editingProfile.name"
            />
          </div>
          <button
            type="button"
            @click="toggleEdit('name')"
            v-if="!editingProfile.name"
          >
            <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
          </button>
          <button type="button" @click="toggleCloseEdit('name')" v-else>
            <img src="/icons/check.svg" alt="Check" width="18" height="18" />
          </button>
        </div>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label>Username</label>
            <input
              type="text"
              name="username"
              v-model="userProfile.username"
              id="profile-username"
              placeholder="Edit your username."
              :disabled="!editingProfile.username"
            />
          </div>
          <button
            type="button"
            @click="toggleEdit('username')"
            v-if="!editingProfile.username"
          >
            <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
          </button>
          <button type="button" @click="toggleCloseEdit('username')" v-else>
            <img src="/icons/check.svg" alt="Check" width="18" height="18" />
          </button>
        </div>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label>Bio</label>
            <input
              type="text"
              name="bio"
              v-model="userProfile.bio"
              id="profile-bio"
              placeholder="Edit your bio."
              :disabled="!editingProfile.bio"
            />
          </div>
          <button
            type="button"
            @click="toggleEdit('bio')"
            v-if="!editingProfile.bio"
          >
            <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
          </button>
          <button type="button" @click="toggleCloseEdit('bio')" v-else>
            <img src="/icons/check.svg" alt="Check" width="18" height="18" />
          </button>
        </div>
      </div>
      <div class="profile-links">
        <h2>Links</h2>
        <p>Your links are visible to everyone on Netlink.</p>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label>URL</label>
            <input
              type="text"
              name="url"
              v-model="userProfile.url"
              id="profile-url"
              placeholder="https://"
              :disabled="!editingProfile.url"
            />
          </div>
          <button
            type="button"
            @click="toggleEdit('url')"
            v-if="!editingProfile.url"
          >
            <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
          </button>
          <button type="button" @click="toggleCloseEdit('url')" v-else>
            <img src="/icons/check.svg" alt="Check" width="18" height="18" />
          </button>
        </div>
      </div>
      <div class="profile-privacy">
        <h2>Privacy</h2>
        <p>
          When your account is public, your profile and posts can be seen by
          anyone, on or off the platform.
        </p>
        <p>
          When your account is private, only the followers you approve can see
          what you share and your followers list and found your profile.
        </p>
        <p>Your profile is currently <span>unlocked</span>.</p>
      </div>
      <button
        type="button"
        class="save-btn"
        @click="saveProfile()"
        :disabled="!hasUnsavedChanges"
        v-if="hasUnsavedChanges"
      >
        Save
      </button>
      <div class="profile-delete">
        <h2>Delete Account</h2>
        <button type="button" class="delete-btn" @click="deleteAccount()">
          Delete
        </button>
      </div>
    </div>
    <div class="dash-content">
      <div class="profile-content">
        <h2>Profile</h2>
        <div class="profile-head" v-if="userProfile">
          <div class="profile-info">
            <h1>{{ userProfile.name }}</h1>
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
              <p>{{ userProfile.bio }}</p>
            </div>
          </div>
          <div class="profile-avatar">
            <img :src="userProfile.avatarUrl" />
          </div>
        </div>
      </div>
      <div class="profile-posts">
        <h2>My Posts</h2>
      </div>
      <Post />
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
.profile-edit,
.profile-links,
.profile-privacy,
.profile-delete {
  margin-bottom: 1.5rem;
}
.profile-edit h2,
.profile-links h2,
.profile-privacy h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  margin-bottom: 1rem;
}
.profile-links p,
.profile-privacy p {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.7rem;
  margin-bottom: 1rem;
}
.profile-privacy span {
  font-family: "Montserrat Medium", sans-serif;
}
.profile-box {
  background-color: rgb(255, 255, 255);
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.profile-box button {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile-boxinput {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.profile-boxinput label {
  font-family: "Montserrat Light", sans-serif;
  font-size: 11px;
  margin-bottom: 0.3rem;
}
.profile-boxinput input {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  border: none;
  outline: none;
  padding: 0.2rem 0;
}
.profile-boxinput input:disabled {
  background-color: transparent;
  color: #535353;
}
.profile-boxinput span {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.save-btn {
  width: 100%;
  padding: 0.8rem 0;
  margin-bottom: 1.5rem;
  border: 2px solid #006145;
  border-radius: 10px;
  background-color: #ffffff;
  font-family: "Montserrat SemiBold", sans-serif;
  color: #006145;
  cursor: pointer;
}
.save-btn:hover {
  background-color: #006145;
  border: 2px solid #ffffff;
  color: #ffffff;
}

.profile-delete h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.delete-btn {
  width: 100%;
  padding: 0.8rem 0;
  border: 2px solid #a90000;
  border-radius: 10px;
  background-color: #ffffff;
  font-family: "Montserrat SemiBold", sans-serif;
  color: #a90000;
  cursor: pointer;
  margin-top: 0.5rem;
}
.delete-btn:hover {
  background-color: #a90000;
  border: 2px solid #ffffff;
  color: #ffffff;
}

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
.profile-content h2,
.profile-posts h2 {
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
</style>
