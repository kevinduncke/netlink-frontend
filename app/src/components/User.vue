<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Profile from "./Profile.vue";
import Post from "./Post.vue";
import SpriteIcon from "./SpriteIcon.vue";
import Modal from "./Modal.vue";

// STYLES
import "../styles/about.css";
import "../styles/profile.css";
import "../styles/utilities.css";
import "../styles/body.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  userProfile,
  selectedUserId,
  dateConverter,
  modalCurrentStatus,
  modalTargetUserId,
  reportData,

  // FUNCTIONS
  resetUserProfile,
  loadSelectedUser,
  unfollowUser,
  followUser,
  createChat,
} = useUserData();

const router = useRouter();

async function handleSendMessage() {
  await createChat(userProfile.value.id);
  await router.push("/messages");
}

onMounted(async () => {
  await loadSelectedUser(selectedUserId.value);
});

watch(selectedUserId, async (newUserId) => {
  if (newUserId) {
    await loadSelectedUser(newUserId);
  }
});

onBeforeRouteLeave((to) => {
  // Only clear selectedUserId if leaving /user route entirely
  if (!to.path.startsWith("/user/")) {
    selectedUserId.value = "";
    resetUserProfile();
  }
});
</script>

<template>
  <Modal v-if="modalCurrentStatus !== 'none'" />
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel scrollable-hidden">
      <div class="about-panel">
        <div class="dash-data-box">
          <h2>About this Account</h2>
          <div class="dash-about-user">
            <SpriteIcon
              name="date"
              size="24"
              color="#535353"
              title="Date Joined"
            />
            <div>
              <p>Date Joined</p>
              <p>{{ dateConverter(userProfile.createdAt) }}</p>
            </div>
          </div>
          <div class="dash-about-user">
            <SpriteIcon name="link-url" size="24" color="#535353" title="URL" />
            <div>
              <p>URL</p>
              <p>https://netlink.local/{{ userProfile.username }}</p>
            </div>
          </div>
        </div>
        <div class="dash-data-box">
          <h2>Actions</h2>
          <button
            class="button"
            type="button"
            @click="
              userProfile.isFollowedByMe
                ? unfollowUser(userProfile.id)
                : followUser(userProfile.id)
            "
          >
            <SpriteIcon
              name="followers"
              size="24"
              color="#535353"
              title="Followers"
            />
            <p>{{ userProfile.isFollowedByMe ? "Unfollow" : "Follow" }}</p>
          </button>
          <button
            class="button"
            type="button"
            v-if="!userProfile.hasRestrictedMe"
            @click="handleSendMessage"
          >
            <SpriteIcon
              name="messages"
              size="24"
              color="#535353"
              title="Messages"
            />
            <p>Send a Message</p>
          </button>
          <button
            class="button"
            type="button"
            @click="
              modalCurrentStatus = userProfile.isBlockedByMe
                ? 'unblock'
                : 'block';
              modalTargetUserId = userProfile.id;
            "
          >
            <SpriteIcon name="block" size="24" color="#535353" title="Block" />
            <p>{{ userProfile.isBlockedByMe ? "Unblock" : "Block" }}</p>
          </button>
          <button
            class="button"
            type="button"
            @click="
              modalCurrentStatus = userProfile.isRestrictedByMe
                ? 'unrestrict'
                : 'restrict';
              modalTargetUserId = userProfile.id;
            "
          >
            <SpriteIcon
              name="restrict"
              size="24"
              color="#535353"
              title="Restrict"
            />
            <p>
              {{ userProfile.isRestrictedByMe ? "Unrestrict" : "Restrict" }}
            </p>
          </button>
          <button
            class="button"
            type="button"
            @click="
              modalCurrentStatus = 'report';
              modalTargetUserId = userProfile.id;
              reportData.referenceId = userProfile.id;
              reportData.type = 'USER';
            "
          >
            <SpriteIcon
              name="report"
              size="24"
              color="#535353"
              title="Report"
            />
            <p>Report</p>
          </button>
        </div>
        <div class="dash-data-box">
          <h2>Share Profile</h2>
          <button class="button" type="button">
            <SpriteIcon
              name="email"
              size="24"
              color="#535353"
              title="Share via Email"
            />
            <p>Share via Email</p>
          </button>
        </div>
      </div>
    </div>
    <div class="dash-content scrollable-hidden">
      <div class="profile-content">
        <h2>Profile</h2>
        <Profile />
      </div>
      <div
        class="private-content"
        v-if="userProfile.accountVisibility === 'private'"
      >
        <SpriteIcon
          name="lock"
          size="48"
          color="#535353"
          title="Private Account"
        />
        <h2>This profile is private</h2>
        <p>Request to follow this user to see their posts.</p>
      </div>
      <div class="posts-content" v-else>
        <h2>Posts</h2>
        <Post />
      </div>
    </div>
  </div>
</template>
