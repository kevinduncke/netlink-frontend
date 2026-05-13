<script setup lang="ts">
// VUE
import { onMounted } from "vue";

// STYLES
import "../styles/body.css";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  notifications,

  // FUNCTIONS
  dateConverter,
  loadNotifications,
} = useUserData();

onMounted(async () => {
  await loadNotifications();
});
</script>

<template>
  <div class="dash-notif-base">
    <div class="notif-head">
      <h2>Notifications</h2>
    </div>
    <div
      class="notif-base"
      v-if="notifications.length > 0"
      v-for="ntf in notifications"
      :key="ntf.id"
    >
      <AvatarIcon />
      <div class="notif-message">
        <span>{{ ntf.fromUser?.username }}</span>
        <p>{{ ntf.content }}</p>
        <span>{{ dateConverter(ntf.createdAt) }}</span>
      </div>
      <div class="notif-box">
        <div class="notif-follow" v-if="ntf.type === 'FOLLOW'">
          <button type="button">
            {{ ntf.fromUser?.isFollowedByMe ? "Following" : "Follow back" }}
          </button>
        </div>
      </div>
    </div>
    <div class="notif-empty" v-else>
      <p class="notif-empty-text">No notifications yet.</p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.dash-notif-base {
  margin-top: 1rem;
}
.notif-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.notif-head button {
  padding: 0 1rem;
}
.notif-base,
.notif-message {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
}
.notif-message {
  gap: 0.2rem;
}
.notif-message span:first-child {
  font-family: "Montserrat SemiBold", sans-serif;
}
.notif-message span:last-child {
  font-size: var(--font-size-caption);
}
.notif-empty-text {
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  text-align: center;
}
</style>
