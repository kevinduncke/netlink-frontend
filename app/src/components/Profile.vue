<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import { onBeforeRouteLeave } from "vue-router";
import Navigation from "./Navigation.vue";

type UserProfile = {
  name: string;
  username: string;
  bio: string;
  url: string;
  avatarUrl: string;
};

const originalProfile = ref({} as UserProfile);

const name = ref("");
const username = ref("");
const bio = ref("");
const url = ref("");
const avatarUrl = ref("");

const postsCount = ref(0);
const followersCount = ref(0);
const followingCount = ref(0);

const editing = ref({
  name: false,
  username: false,
  bio: false,
  url: false,
  avatarUrl: false,
});

function toggleEdit(field: keyof typeof editing.value) {
  editing.value[field] = !editing.value[field];
}

onMounted(async () => {
  const res = await api.get("/users/me");
  name.value = res.data.name ?? "";
  username.value = res.data.username ?? "";
  bio.value = res.data.bio ?? "";
  url.value = res.data.url ?? "";
  avatarUrl.value = res.data.avatarUrl ?? "";

  postsCount.value = res.data.postsCount ?? 0;
  followersCount.value = res.data.followersCount ?? 0;
  followingCount.value = res.data.followingCount ?? 0;

  originalProfile.value = structuredClone(res.data);
});

async function saveProfile() {
  try {
    await api.patch("/users/me", {
      name: name.value,
      username: username.value,
      bio: bio.value,
      url: url.value,
      avatarUrl: avatarUrl.value,
    });

    editing.value = {
      name: false,
      username: false,
      bio: false,
      url: false,
      avatarUrl: false,
    };

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile: ", error);
    alert("Failed to update profile. Please try again.");
  }
}

// COMPONENT DEACTIVATION GUARD FOR UNSAVED CHANGES
onBeforeRouteLeave(() => {
  const hasUnsavedChanges = Object.values(editing.value).some(
    (isEditing) => isEditing
  );

  if(!hasUnsavedChanges){
    return true;
  }

  const confirmLeave = confirm(
    "You have unsaved changes. Are you sure you want to leave without saving?"
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
              v-model="name"
              id="profile-name"
              :disabled="!editing.name"
            />
          </div>
          <button type="button" @click="toggleEdit('name')">
            <svg
              v-if="!editing.name"
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#535353"
            >
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#535353"
            >
              <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
            </svg>
          </button>
        </div>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label>Username</label>
            <input
              type="text"
              name="username"
              v-model="username"
              id="profile-username"
              :disabled="!editing.username"
            />
          </div>
          <button type="button" @click="toggleEdit('username')">
            <svg
              v-if="!editing.username"
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#535353"
            >
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#535353"
            >
              <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
            </svg>            
          </button>
        </div>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label>Bio</label>
            <input
              type="text"
              name="bio"
              v-model="bio"
              id="profile-bio"
              :disabled="!editing.bio"
            />
          </div>
          <button type="button" @click="toggleEdit('bio')">
            <svg
              v-if="!editing.bio"
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#535353"
            >
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#535353"
            >
              <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
            </svg>            
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
              v-model="url"
              id="profile-url"
              placeholder="https://"
              :disabled="!editing.url"
            />
          </div>
          <button type="button" @click="toggleEdit('url')">
            <svg
              v-if="!editing.url"
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#535353"
            >
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#535353"
            >
              <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
            </svg>            
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
        <button type="button" class="profile-privacy-btn">Lock</button>
      </div>
      <button type="button" class="save-btn" @click="saveProfile">Save Changes</button>
    </div>
    <div class="dash-content">
      <div class="profile-content">
        <h2>Profile</h2>
        <div class="profile-head">
          <div class="profile-info">
            <h1>{{ name || "Unknown User" }}</h1>
            <h2>@{{ username || "Unknown Username" }}</h2>
            <div class="profile-stats">
              <div>
                <p>{{ postsCount || 0 }} Posts</p>
              </div>
              <div>
                <p>{{ followersCount || 0 }} Followers</p>
              </div>
              <div>
                <p>{{ followingCount || 0 }} Following</p>
              </div>
            </div>
            <div class="profile-titles">
              <p>{{ bio || "No bio available." }}</p>
            </div>
          </div>
          <div class="profile-avatar">
            <img :src="avatarUrl" alt="Avatar" />
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
  overflow-y: scroll;
}
.profile-edit,
.profile-links,
.profile-privacy {
  margin-bottom: 2rem;
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
.profile-privacy-btn {
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  padding: 0.8rem 0;
  background-color: #006145;
  color: #ffffff;
  border: none;
  outline: none;
}
.save-btn {
  width: 100%;
  padding: 0.8rem 0;
  border: 2px solid #006145;
  border-radius: 10px;
  background-color: #ffffff;
  font-family: "Montserrat SemiBold", sans-serif;
  color: #006145;
}

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
.profile-content h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  margin-bottom: 1rem;
}
.profile-head {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
  border-radius: 30px;
}
</style>
