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
  reportData,

  // FUNCTIONS
  blockUser,
  unblockUser,
  restrictUser,
  unrestrictUser,
  handleReport,
  closeModal,
} = useUserData();

const reportReasons = [
  {
    id: "bullying",
    label: "Bullying or harassment",
  },
  {
    id: "spam",
    label: "Spam or misleading information",
  },
  {
    id: "selfinjury",
    label: "Self-harm or suicide",
  },
  {
    id: "hate",
    label: "Hate speech or violence",
  },
  {
    id: "items",
    label: "Selling or promoting restricted items",
  },
  {
    id: "sexual",
    label: "Sexually explicit content",
  },
  {
    id: "information",
    label: "Misleading information",
  },
];

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
        title: "Report",
        description:
          "Reporting a user will send their profile and recent activity to our moderation team for review. We take all reports seriously and will take appropriate action if any violations of our community guidelines are found.",
        actionText: "Report",
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
  switch (reportData.type) {
    case "USER":
      return "user";
    case "POST":
      return "post";
    case "COMMENT":
      return "comment";
    case "MESSAGE":
      return "message";
    default:
      return "";
  }
});
</script>
<template>
  <div class="modal-overlay scrollable-hidden">
    <div class="modal-content">
      <div class="modal-data">
        <h2>{{ modalOptions.title }} {{ reportType }}</h2>
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
          <p>Why are you reporting this {{ reportType }}?</p>
          <div class="report-reason">
            <div
              v-for="reason in reportReasons"
              :key="reason.id"
              class="post-types"
            >
              <input
                v-model="reportData.reason"
                type="radio"
                name="report-reason"
                :id="reason.id"
                :value="reason.label"
              />
              <label :for="reason.id">{{ reason.label }}</label>
            </div>
          </div>
          <div class="report-details">
            <p>Can you give a brief description of why are you reporting?</p>
            <input
              type="text"
              id="report-input"
              name="Report details"
              v-model="reportData.details"
              placeholder="Report details (optional)"
            />
          </div>
        </div>
      </div>
      <div class="mdl-actions">
        <button class="button" type="button" @click="closeModal()">
          Cancel
        </button>
        <button
          class="button mdl-action"
          type="button"
          :disabled="reportData.reason === null"
          @click="modalOptions.actionHandler()"
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
.report-reason {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}
.post-types {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}
.post-types label {
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-caption);
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
