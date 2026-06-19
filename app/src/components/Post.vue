<script setup lang="ts">
// VUE
import { onMounted } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";

// STYLES
import "../styles/utilities.css";
import "../styles/body.css";
import "../styles/post.css";
import "../styles/comments.css";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";
import SpriteIcon from "./SpriteIcon.vue";

// COMPONENTS
import Modal from "./Modal.vue";

// USER FUNCTIONS + DATA
import { useUserData } from "../shared/userData";
const {
  // VARIABLES
  modalCurrentStatus,

  // FUNCTIONS
  selectedUser,
  getUserRoute,
  loadSelectedUser,
} = useUserData();

// POST FUNCTIONS + DATA
import { usePosts } from "../shared/usePosts.ts";
const {
  // VARIABLES
  selectedPostId,
  loadPost,
  uniquePost,

  // POST FUNCTIONS
  likePost,
  repost,

  // OPTION MODALS

  // HELPER FUNCTIONS
  isAuthorPost,
  toUtcDateTime,
} = usePosts();

onMounted(async () => {
  await loadPost(selectedPostId.value);
});
</script>
<template>
  <Modal v-if="modalCurrentStatus !== 'none'" />
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel scrollable-hidden">
      <div class="post-comment-base">
        <h2>New Comment</h2>
        <div></div>
      </div>
      <div class="post-liked">
        <h2>Likes</h2>
        <div></div>
      </div>
      <div class="post-shared">
        <h2>Shares</h2>
        <div></div>
      </div>
    </div>
    <div class="dash-content scrollable-hidden">
      <div class="post-info">
        <h2>Information</h2>
        <div></div>
      </div>
      <!-- INFO ABOUT THIS POST + ACTIONS (REPORT, EDIT) -->
      <div class="post-base">
        <h2>Post</h2>
        <div class="dash-post shadow-light">
          <div class="dash-user-post">
            <div class="dash-username">
              <AvatarIcon />
              <div>
                <span>
                  <RouterLink
                    :to="
                      getUserRoute(
                        uniquePost.author?.username,
                        uniquePost.author?.id,
                      )
                    "
                    @click="selectedUser(uniquePost.author?.id)"
                  >
                    {{ uniquePost.author?.name }}
                  </RouterLink>
                </span>
              </div>
            </div>
          </div>
          <div class="dash-content-post">
            <span>
              {{ uniquePost.content }}
            </span>
            <span v-for="mention in uniquePost.mentions" :key="mention.id">
              <RouterLink
                :to="getUserRoute(mention.username, mention.id)"
                @click="
                  (selectedUser(mention.id), loadSelectedUser(mention.id))
                "
              >
                @{{ mention.username }}
              </RouterLink>
            </span>
          </div>
          <div class="dash-options-post">
            <button
              class="button"
              type="button"
              :class="{ 'dash-commented': uniquePost._count?.comments }"
              :disabled="true"
              v-if="!uniquePost.disableComments"
            >
              <SpriteIcon
                name="comment"
                size="16"
                color="#535353"
                title="Comments"
              />
              <span>{{ uniquePost._count?.comments || 0 }}</span>
            </button>
            <button
              class="button"
              type="button"
              @click="likePost(uniquePost.id, uniquePost.author?.liked)"
              :class="{ 'dash-liked': uniquePost.author?.liked }"
              :disabled="uniquePost.userRestrictedMe"
            >
              <SpriteIcon
                name="heart"
                size="16"
                color="#535353"
                title="Likes"
              />
              <span v-if="!uniquePost.hideLikes">{{
                uniquePost._count?.likes || 0
              }}</span>
            </button>
            <button
              class="button"
              type="button"
              :class="{ 'dash-shared': uniquePost._count?.shares }"
              :disabled="uniquePost.userRestrictedMe"
              @click="repost(uniquePost.id, uniquePost.repostedByMe)"
              v-if="isAuthorPost(uniquePost.author?.id)"
            >
              <SpriteIcon
                name="share"
                size="16"
                color="#535353"
                title="Shares"
              />
              <span>{{ uniquePost._count?.shares || 0 }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- POST -->
      <div class="post-comments">
        <h2>Comments</h2>
        <div class="dash-comment shadow-light">
          <div
            class="dash-username-comment"
            v-for="comment in uniquePost.comments"
            :key="comment.id"
          >
            <div class="dash-usercmt-info">
              <AvatarIcon height="32px" width="32px" />
              <span>
                <RouterLink
                  :to="
                    getUserRoute(comment.author?.username, comment.author?.id)
                  "
                  @click="selectedUser(comment.author?.id)"
                >
                  {{ comment.author?.name }}
                </RouterLink>
              </span>
            </div>
            <p>{{ comment.content }}</p>
            <p>{{ toUtcDateTime(comment.createdAt) }}</p>
          </div>
        </div>
      </div>
      <!-- NEW COMMENT ON THIS POST -->
    </div>
  </div>
</template>
<style scoped></style>
