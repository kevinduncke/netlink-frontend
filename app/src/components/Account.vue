<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Profile from "./Profile.vue";
import Post from "./Post.vue";
import LoadingState from "./states/LoadingState.vue";
import ErrorState from "./states/ErrorState.vue";
import EmptyState from "./states/EmptyState.vue";
import SkeletonPost from "./states/SkeletonPost.vue";

// STYLES
import "../styles/app-layout.css";
import "../styles/input.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  userProfile,
  originalProfile,
  editingProfile,
  hasUnsavedChanges,
  selectedUserId,
  loadingMyProfile,
  myProfileError,

  // FUNCTIONS
  loadMyProfile,
  resetUserProfile,
  toggleEdit,
  toggleCloseEdit,
  saveProfile,
  changePrivacyAccount,
  deleteAccount,
  updateUnsavedProfileChanges,
} = useUserData();

const { userdata, loadingPosts, postsError, loadPosts } = usePosts();

async function refreshAccountPosts() {
  await loadPosts("my-posts");
}

onMounted(async () => {
  selectedUserId.value = "";
  resetUserProfile();
  await loadMyProfile();
  await loadPosts("my-posts");
});
watch(
  () => [
    userProfile.value.name,
    userProfile.value.username,
    userProfile.value.bio,
    userProfile.value.url,
    userProfile.value.avatarUrl,
    userProfile.value.privacyMode,
    originalProfile.value.name,
    originalProfile.value.username,
    originalProfile.value.bio,
    originalProfile.value.url,
    originalProfile.value.avatarUrl,
    originalProfile.value.privacyMode,
  ],
  () => {
    updateUnsavedProfileChanges();
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
  <div class="app-layout">
    <Navigation />
    <div class="dash-sidepanel scrollable-hidden">
      <div class="profile-edit">
        <h2>Edit Profile</h2>
        <LoadingState
          v-if="loadingMyProfile"
          title="Loading profile"
          message="Fetching your account details."
        />
        <ErrorState
          v-else-if="myProfileError"
          :message="myProfileError"
          @retry="loadMyProfile"
        />
        <div v-else>
          <div class="profile-box body-box shadow-light">
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
              class="button"
              type="button"
              @click="toggleEdit('name')"
              v-if="!editingProfile.name"
            >
              <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
            </button>
            <button
              class="button"
              type="button"
              @click="toggleCloseEdit('name')"
              v-else
            >
              <img src="/icons/check.svg" alt="Check" width="18" height="18" />
            </button>
          </div>
          <div class="profile-box body-box shadow-light">
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
              class="button"
              type="button"
              @click="toggleEdit('username')"
              v-if="!editingProfile.username"
            >
              <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
            </button>
            <button
              class="button"
              type="button"
              @click="toggleCloseEdit('username')"
              v-else
            >
              <img src="/icons/check.svg" alt="Check" width="18" height="18" />
            </button>
          </div>
          <div class="profile-box body-box shadow-light">
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
              class="button"
              type="button"
              @click="toggleEdit('bio')"
              v-if="!editingProfile.bio"
            >
              <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
            </button>
            <button
              class="button"
              type="button"
              @click="toggleCloseEdit('bio')"
              v-else
            >
              <img src="/icons/check.svg" alt="Check" width="18" height="18" />
            </button>
          </div>
        </div>
        <div class="profile-links">
          <h2>Links</h2>
          <p>Your links are visible to everyone on Netlink.</p>
          <div class="profile-box body-box shadow-light">
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
              class="button"
              type="button"
              @click="toggleEdit('url')"
              v-if="!editingProfile.url"
            >
              <img src="/icons/edit.svg" alt="Edit" width="18" height="18" />
            </button>
            <button
              class="button"
              type="button"
              @click="toggleCloseEdit('url')"
              v-else
            >
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
          <p>
            Your profile is currently
            <span>{{ userProfile.privacyMode ? "locked." : "unlocked." }}</span>
          </p>
          <button
            type="button"
            class="button"
            @click="changePrivacyAccount(userProfile.privacyMode)"
          >
            {{ userProfile.privacyMode ? "Unlock" : "Lock" }} Account
          </button>
        </div>
        <button
          type="button"
          class="save-btn button"
          @click="saveProfile()"
          :disabled="!hasUnsavedChanges"
          v-if="hasUnsavedChanges"
        >
          Save
        </button>
        <div class="profile-delete">
          <h2>Delete Account</h2>
          <button
            type="button"
            class="delete-btn button"
            @click="deleteAccount()"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="dash-content scrollable-hidden">
      <div class="profile-content">
        <h2>Profile</h2>
        <LoadingState
          v-if="loadingMyProfile"
          title="Loading profile"
          message="Preparing your public profile."
        />
        <ErrorState
          v-else-if="myProfileError"
          :message="myProfileError"
          @retry="loadMyProfile"
        />
        <Profile v-else />
      </div>
      <div class="profile-posts">
        <h2>My Posts</h2>
      </div>
      <SkeletonPost v-if="loadingPosts" />
      <ErrorState
        v-else-if="postsError"
        :message="postsError"
        @retry="refreshAccountPosts"
      />
      <Post v-else-if="userdata.length > 0" />
      <EmptyState
        v-else
        title="No posts yet"
        message="Create your first post to show it here."
        icon="create"
      />
    </div>
  </div>
</template>

<style scoped>
/* PROFILE SIDEPANEL */
.profile-edit,
.profile-links,
.profile-privacy,
.profile-delete {
  margin-bottom: 1.5rem;
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
.profile-privacy button {
  width: 100%;
  padding: 0.8rem 0;
  border: 2px solid var(--color-gray-700);
  border-radius: var(--radius-md);
  font-family: "Montserrat SemiBold", sans-serif;
  color: var(--color-gray-800);
}
.profile-privacy button:hover {
  background-color: var(--color-white);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.profile-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.profile-box button {
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
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  font-family: "Montserrat SemiBold", sans-serif;
  color: var(--color-primary);
}
.save-btn:hover {
  background-color: var(--color-primary);
  border: 2px solid var(--color-white);
  color: var(--color-white);
}
.delete-btn {
  width: 100%;
  padding: 0.8rem 0;
  border: 2px solid var(--color-gray-700);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  font-family: "Montserrat SemiBold", sans-serif;
  color: var(--color-gray-800);
  margin-top: var(--spacing-sm);
}
.delete-btn:hover {
  background-color: var(--color-white);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}
.dash-empty-myPosts {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dash-empty-myPosts h2 {
  font-family: "Montserrat Light", sans-serif;
  font-size: 1.25rem;
}
</style>
