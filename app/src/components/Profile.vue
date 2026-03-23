<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
import Navigation from "./Navigation.vue";

// COMPONENT DEACTIVATION GUARD FOR UNSAVED CHANGES
onBeforeRouteLeave((to, from, next) => {
  // CHECK IF THERE ARE UNSAVED CHANGES
  if (hasUnsavedChanges()) {
    const answer = window.confirm(
      "You have unsaved changes. Do you really want to leave?",
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

function hasUnsavedChanges() {
  return true; // REPLACE WITH ACTUAL LOGIC TO CHECK FOR UNSAVED CHANGES
}
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
            <input type="text" name="name" id="profile-name" />
          </div>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#535353"
            >
              <path
                d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
              />
            </svg>
          </button>
        </div>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label for="username">Username</label>
            <input type="text" name="username" id="profile-username" />
          </div>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#535353"
            >
              <path
                d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
              />
            </svg>
          </button>
        </div>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label for="bio">Bio</label>
            <input type="text" name="bio" id="profile-bio" />
          </div>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#535353"
            >
              <path
                d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="profile-links">
        <h2>Links</h2>
        <p>Your links are visible to everyone on Netlink.</p>
        <div class="profile-box">
          <div class="profile-boxinput">
            <label for="url">URL</label>
            <input
              type="text"
              name="url"
              id="profile-url"
              placeholder="https://"
            />
          </div>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#535353"
            >
              <path
                d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
              />
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
    </div>
    <div class="dash-content">
      <div class="profile-content">
        <h2>Profile</h2>
        <div class="profile-head">
          <div class="profile-info">
            <h1>Kyla Dodds</h1>
            <h2>@kyladodds</h2>
            <div class="profile-stats">
              <div>
                <p>1 Posts</p>
              </div>
              <div>
                <p>24 Followers</p>
              </div>
              <div>
                <p>231 Following</p>
              </div>
            </div>
            <div class="profile-titles">
              <p>Network Architect</p>
              <p>
                Let's grow together | Tech & Engineer Lifestyle <br />
                Founder of @kyladoddsnetworks | Host of @netlinkpodcast <br />
                Florida | DM for collabs
              </p>
            </div>
          </div>
          <div class="profile-avatar">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr 2fr;
  grid-template-rows: 100vh;
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

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
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
  justify-content: space-between;
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
}
</style>
