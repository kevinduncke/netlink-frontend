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
  reportData,

  // FUNCTIONS
  blockUser,
  unblockUser,
  restrictUser,
  unrestrictUser,
  handleReport,
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
        actionHandler: () => handleReport(),
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
    case "Post":
      return "Report Post";
    case "Message":
      return "Report Message";
    case "User":
      return "Report User";
    case "None":
      return "None";
    default:
      return "Unable to report";
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
            <p>They won't be able to like or comment on your posts.</p>
          </div>
          <div class="restrict-info-content">
            <SpriteIcon
              name="messages"
              size="24"
              color="#535353"
              title="Messages"
            />
            <p>They won't be able to send you direct messages.</p>
          </div>
        </div>
        <div v-if="modalCurrentStatus === 'report'">
          <div v-if="reportType === 'None'">
            <p>What do you want to report?</p>
            <div class="report-subtypes">
              <div class="subtypes-actions">
                <button
                  type="button"
                  class="button"
                  @click="modalReportTypes = 'User'"
                >
                  Report User
                </button>
                <button
                  type="button"
                  class="button"
                  @click="modalReportTypes = 'Post'"
                >
                  Report Post
                </button>
              </div>
              <div class="subtypes-actions">
                <button
                  type="button"
                  class="button"
                  @click="modalReportTypes = 'Comment'"
                >
                  Report Comment
                </button>
                <button
                  type="button"
                  class="button"
                  @click="modalReportTypes = 'Message'"
                >
                  Report Message
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="report-details" v-if="reportType !== 'None'">
          <p>
            Can you give a brief description of why are you reporting this user?
          </p>
          <input
            type="text"
            id="report-input"
            name="Report details"
            v-model="reportData.details"
            placeholder="Report details (optional)"
          />
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
          @click="modalOptions.actionHandler()"
          v-if="reportType !== 'None'"
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
  text-align: justify;
  padding-top: 1rem;
}
.report-subtypes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.report-details {
  margin-top: 1rem;
}
.report-details p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  color: var(--color-gray-800);
  text-align: left;
}
.report-details input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  box-sizing: border-box;
}
.report-details input:focus {
  outline: none;
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
  padding: 0.55rem 0;
  border: none;
  font-family: "Montserrat Medium", sans-serif;
  font-size: var(--font-size-label);
  cursor: pointer;
}
.modal-content button:hover {
  background: var(--color-gray-100);
}
.mdl-action {
  color: var(--color-error);
}
</style>
