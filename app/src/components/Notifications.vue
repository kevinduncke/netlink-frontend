<script setup lang="ts">
// VUE
import { onMounted } from "vue";

// COMPONENTS
import SpriteIcon from "./SpriteIcon.vue";
import LoadingState from "./states/LoadingState.vue";
import ErrorState from "./states/ErrorState.vue";
import EmptyState from "./states/EmptyState.vue";

// STYLES
import "../styles/buttons.css";
import "../styles/body.css";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  notifications,
  loadingNotifications,
  notificationsError,

  // FUNCTIONS
  dateConverter,
  loadNotifications,
  markAllNotificationsAsRead,
  unfollowUser,
  followUser,
  getUserRoute,
  selectedUser,
} = useUserData();

async function handleNotificationFollow(ntf: {
  id: string | number;
  isFollowedByMe?: boolean;
  fromUser?: { id?: string | number };
}) {
  if (ntf.fromUser?.id === undefined) return;

  if (ntf.isFollowedByMe) {
    await unfollowUser(ntf.fromUser.id);
  } else {
    await followUser(ntf.fromUser.id);
  }
}

onMounted(async () => {
  await loadNotifications();
});
</script>

<template>
  <div class="dash-notif-base">
    <div class="notif-head">
      <h2>Notifications</h2>
      <div
        class="notif-actions"
        v-if="notifications && notifications.unReadNotifications > 0"
      >
        <button
          type="button"
          class="button"
          @click="markAllNotificationsAsRead"
        >
          <SpriteIcon
            name="checked"
            size="22"
            color="#535353"
            title="Check all notifications as read"
          />
        </button>
        <div class="notif-count">
          <span>
            {{ notifications.unReadNotifications }}
          </span>
        </div>
      </div>
    </div>
    <LoadingState
      v-if="loadingNotifications"
      title="Loading notifications"
      message="Fetching your latest activity."
    />
    <ErrorState
      v-else-if="notificationsError"
      :message="notificationsError"
      @retry="loadNotifications"
    />
    <template
      v-else-if="
        notifications &&
        (notifications.today.length > 0 ||
          notifications.yesterday.length > 0 ||
          notifications.older.length > 0)
      "
    >
      <div class="notif-section" v-if="notifications.today.length > 0">
        <h3>Today</h3>
        <div
          class="notif-base"
          :class="{ 'notif-unread': ntf.read === false }"
          v-for="ntf in notifications.today"
          :key="ntf.id"
        >
          <div class="notif-box">
            <AvatarIcon />
            <div>
              <div class="notif-message">
                <span>
                  <RouterLink
                    v-if="ntf.fromUser?.username"
                    :to="getUserRoute(ntf.fromUser?.username, ntf.fromUser?.id)"
                    @click="selectedUser(ntf.fromUser?.id)"
                  >
                    {{ ntf.fromUser?.name }}
                  </RouterLink>
                  {{ ntf.content }}
                </span>
              </div>
              <div class="notif-message">
                <span>{{ dateConverter(ntf.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="notif-box">
            <div
              class="notif-follow"
              v-if="ntf.type === 'FOLLOW' && ntf.fromUser?.id !== undefined"
            >
              <button
                type="button"
                :class="ntf.isFollowedByMe ? 'unfollow-btn' : 'follow-btn'"
                @click="handleNotificationFollow(ntf)"
              >
                {{ ntf.isFollowedByMe ? "Unfollow" : "Follow" }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="notif-section" v-if="notifications.yesterday.length > 0">
        <h3>Yesterday</h3>
        <div
          class="notif-base"
          :class="{ 'notif-unread': ntf.read === false }"
          v-for="ntf in notifications.yesterday"
          :key="ntf.id"
        >
          <div class="notif-box">
            <AvatarIcon />
            <div>
              <div class="notif-message">
                <span>
                  <RouterLink
                    v-if="ntf.fromUser?.username"
                    :to="getUserRoute(ntf.fromUser?.username, ntf.fromUser?.id)"
                    @click="selectedUser(ntf.fromUser?.id)"
                  >
                    {{ ntf.fromUser?.name }}
                  </RouterLink>
                  {{ ntf.content }}
                </span>
              </div>
              <div class="notif-message">
                <span>{{ dateConverter(ntf.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="notif-box">
            <div
              class="notif-follow"
              v-if="ntf.type === 'FOLLOW' && ntf.fromUser?.id !== undefined"
            >
              <button
                type="button"
                :class="ntf.isFollowedByMe ? 'unfollow-btn' : 'follow-btn'"
                @click="handleNotificationFollow(ntf)"
              >
                {{ ntf.isFollowedByMe ? "Unfollow" : "Follow" }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="notif-section" v-if="notifications.older.length > 0">
        <h3>Older</h3>
        <div
          class="notif-base"
          :class="{ 'notif-unread': ntf.read === false }"
          v-for="ntf in notifications.older"
          :key="ntf.id"
        >
          <div class="notif-box">
            <AvatarIcon />
            <div>
              <div class="notif-message">
                <span>
                  <RouterLink
                    v-if="ntf.fromUser?.username"
                    :to="getUserRoute(ntf.fromUser?.username, ntf.fromUser?.id)"
                    @click="selectedUser(ntf.fromUser?.id)"
                  >
                    {{ ntf.fromUser?.name }}
                  </RouterLink>
                  {{ ntf.content }}
                </span>
              </div>
              <div class="notif-message">
                <span>{{ dateConverter(ntf.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="notif-box">
            <div
              class="notif-follow"
              v-if="ntf.type === 'FOLLOW' && ntf.fromUser?.id !== undefined"
            >
              <button
                type="button"
                :class="ntf.isFollowedByMe ? 'unfollow-btn' : 'follow-btn'"
                @click="handleNotificationFollow(ntf)"
              >
                {{ ntf.isFollowedByMe ? "Unfollow" : "Follow" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <EmptyState
      v-else
      title="No notifications yet"
      message="Activity from the people you follow will appear here."
      icon="bell"
    />
  </div>
</template>

<style lang="css" scoped>
.dash-notif-base {
  margin-top: 1rem;
}
.notif-section h3 {
  font-family: "Montserrat Light", sans-serif;
  font-size: var(--font-size-label);
  margin-bottom: 0.75rem;
}
.notif-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.notif-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
.notif-actions button:hover > svg {
  fill: var(--color-primary);
}
.notif-count {
  background: var(--color-primary);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-family: "Montserrat Medium", sans-serif;
}
.notif-base {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.35rem;
}
.notif-unread {
  background: var(--color-gray-75);
  border-radius: var(--radius-md);
}
.notif-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1rem;
}
.notif-message {
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-label);
  margin: 0.25rem 0;
}
.notif-message a {
  font-family: "Montserrat SemiBold", sans-serif;
  color: var(--color-primary);
  text-decoration: none;
}
.notif-message a:hover {
  background: none;
}
.notif-empty-text {
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-label);
  text-align: center;
}
.notif-follow button {
  cursor: pointer;
  font-size: var(--font-size-label);
  color: var(--color-white);
  border: 2px solid var(--color-primary);
}
.notif-follow button:hover {
  color: var(--color-primary);
}
.notif-follow .unfollow-btn {
  color: var(--color-gray-800);
  border-color: 2px solid var(--color-gray-400);
}
.notif-follow .unfollow-btn:hover {
  color: var(--color-white);
  border: 2px solid var(--color-primary);
}
</style>
