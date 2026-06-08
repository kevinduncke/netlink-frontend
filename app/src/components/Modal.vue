<script setup lang="ts">
// VUE
import { computed } from "vue";

// COMPOSITION
import SpriteIcon from "./SpriteIcon.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  modalCurrentStatus,
  modalTargetUserId,
  modalReportTypes,

  // FUNCTIONS
  blockUser,
  unblockUser,
  restrictUser,
  unrestrictUser,
  reportUser,
} = useUserData();

const modalOptions = computed(() => {
  switch (modalCurrentStatus.value) {
    case "block":
      return {
        title: "Block User",
        description:
          "They won't be able to contact you or find your profile or posts on Netlink. Netlink won't notify them that you've blocked them.",
        actionText: "Block User",
        actionHandler: () => blockUser(modalTargetUserId.value),
      };
    case "unblock":
      return {
        title: "Unblock User",
        description:
          "They will be able to contact you and find your profile or posts on Netlink again.",
        actionText: "Unblock User",
        actionHandler: () => unblockUser(modalTargetUserId.value),
      };
    case "restrict":
      return {
        title: "Restrict User",
        description:
          "Limit their interactions with you without blocking them. They won't know you've restricted them.",
        actionText: "Restrict User",
        actionHandler: () => restrictUser(modalTargetUserId.value),
      };
    case "unrestrict":
      return {
        title: "Unrestrict User",
        description:
          "They will be able to see your profile, posts, comments and send you messages, etc.",
        actionText: "Unrestrict User",
        actionHandler: () => unrestrictUser(modalTargetUserId.value),
      };
    case "report":
      return {
        title: "Report User",
        description:
          "Reporting a user will send their profile and recent activity to our moderation team for review. We take all reports seriously and will take appropriate action if any violations of our community guidelines are found.",
        actionText: "Report User",
        type: "",
        actionHandler: () => reportUser(modalTargetUserId.value, ""),
      };
    default:
      return {
        title: "",
        description: "",
        actionText: "",
        actionHandler: () => {},
      };
  }
});
const reportType = computed(() => {
  switch (modalReportTypes.value) {
    case "Account":
      return "Report Account";
    case "Post":
      return "Report Post";
    case "Message":
      return "Report Message";
    default:
      return "Report User";
  }
});
</script>
<template>
  <div class="modal-overlay scrollable-hidden">
    <div class="modal-content">
      <div class="modal-data">
        <h2>{{ modalOptions.title }}</h2>
        <p>{{ modalOptions.description }}</p>
        <div v-if="modalCurrentStatus === 'restrict'" class="restrict-info">
          <div class="restrict-info-content">
            <SpriteIcon
              name="heart"
              size="24"
              color="#535353"
              title="Restrict"
            />
            <p>
              They won't be able to like or comment on your posts.
            </p>
          </div>
          <div class="restrict-info-content">
            <SpriteIcon
              name="messages"
              size="24"
              color="#535353"
              title="Messages"
            />
            <p>
              They won't be able to send you direct messages.
            </p>
          </div>
        </div>
        <div v-if="modalCurrentStatus === 'report'">
          <p>Why are you reporting this user?</p>
          <button type="button" class="button">{{ reportType }}</button>
        </div>
      </div>
      <div class="mdl-actions">
        <button
          class="button"
          type="button"
          @click="modalCurrentStatus = 'none'"
        >
          Cancel
        </button>
        <button
          class="button mdl-action"
          type="button"
          @click="modalOptions.actionHandler"
        >
          {{ modalOptions.actionText }}
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-md);
  width: min(100%, 500px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal-data {
  padding: 1.5rem;
  text-align: center;
}
.modal-content h2 {
  font-family: "Montserrat Medium", sans-serif;
  font-size: var(--font-size-body-lg);
  margin: 0;
}
.modal-content p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  color: var(--color-gray-800);
  text-align: center;
  padding-top: 1rem;
}
.restrict-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.restrict-info-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
}
.restrict-info-content p {
  padding: 0;
}
.mdl-actions {
  display: flex;
  width: 100%;
  justify-content: center;
}
.modal-content button {
  background: var(--color-white);
  width: 100%;
  padding: 0.95rem 0;
  border: none;
  font-family: "Montserrat Medium", sans-serif;
  cursor: pointer;
}
.modal-content button:hover {
  background: var(--color-gray-50);
}
.mdl-action {
  color: var(--color-error);
}
</style>
