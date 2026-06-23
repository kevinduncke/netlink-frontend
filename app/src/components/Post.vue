<script setup lang="ts">
// VUE
import { onMounted } from "vue";

// SERVICES
import { router } from "../router";

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
  modalTargetUserId,
  reportData,

  // FUNCTIONS
  selectedUser,
  unfollowUser,
  followUser,
  getUserRoute,
  loadSelectedUser,
} = useUserData();

// POST FUNCTIONS + DATA
import { usePosts } from "../shared/usePosts.ts";
const {
  // VARIABLES
  selectedPostId,
  loadPost,
  loadShare,
  uniquePost,
  uniquePostType,
  uniquePostComment,

  // POST FUNCTIONS
  likePost,
  repost,
  newUniqueComment,
  // OPTION MODALS

  // HELPER FUNCTIONS
  isAuthorPost,
  toUtcDateTime,
} = usePosts();

onMounted(async () => {
  if (uniquePostType.value === "Post") {
    await loadPost(selectedPostId.value);
  } else if (uniquePostType.value === "Share") {
    await loadShare(selectedPostId.value);
  }
  if (!uniquePost.value.content) {
    router.push("/dashboard");
  }
});
</script>
<template>
  <Modal v-if="modalCurrentStatus !== 'none'" />
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel scrollable-hidden">
      <div class="post-comment-base">
        <h2>New Comment</h2>
        <div class="post-comment-text shadow-light">
          <textarea
            name="new-comment"
            id="new-comment"
            placeholder="What's on your mind today?"
            v-model="uniquePostComment"
          ></textarea>
        </div>
        <button
          class="button shadow-light"
          type="button"
          @click="newUniqueComment(uniquePost.id)"
        >
          Comment
        </button>
      </div>
      <div class="post-liked">
        <h2>Likes</h2>
        <div
          v-if="uniquePost.likes?.length"
          v-for="liker in uniquePost.likes"
          :key="liker.id"
        >
          <div class="user-box-connection">
            <div class="box-user-info">
              <RouterLink
                :to="getUserRoute(liker.user.username, liker.user.id)"
                @click="selectedUser(liker.user.id)"
              >
                <div class="bar-user-avatardata">
                  <AvatarIcon />
                  <div class="bar-userdata">
                    <h2 class="bar-user-name">{{ liker.user.name }}</h2>
                    <p class="bar-user-username">@{{ liker.user.username }}</p>
                  </div>
                </div>
              </RouterLink>
              <div>
                <button
                  class="unfollow-btn"
                  :class="
                    liker.user.isFollowedByMe ? 'unfollow-btn' : 'follow-btn'
                  "
                  @click="
                    liker.user.isFollowedByMe
                      ? unfollowUser(liker.user.id)
                      : followUser(liker.user.id)
                  "
                >
                  {{ liker.user.isFollowedByMe ? "Unfollow" : "Follow" }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="dash-likes-empty">
          <SpriteIcon name="heart" size="28" color="#535353" title="Likes" />
          <p>No likes yet.</p>
        </div>
      </div>
      <div class="post-shared">
        <h2>Shares</h2>
        <div
          v-if="uniquePost.shares?.length"
          v-for="shared in uniquePost.shares"
          :key="shared.id"
        >
          <div class="user-box-connection">
            <div class="box-user-info">
              <RouterLink
                :to="getUserRoute(shared.user.username, shared.user.id)"
                @click="selectedUser(shared.user.id)"
              >
                <div class="bar-user-avatardata">
                  <AvatarIcon />
                  <div class="bar-userdata">
                    <h2 class="bar-user-name">{{ shared.user.name }}</h2>
                    <p class="bar-user-username">@{{ shared.user.username }}</p>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
        <div v-else class="dash-shares-empty">
          <SpriteIcon name="share" size="28" color="#535353" title="Shares" />
          <p>No shares yet.</p>
        </div>
      </div>
    </div>
    <div class="dash-content scrollable-hidden">
      <div class="post-info">
        <h2>Information</h2>
        <div class="dash-info">
          <div>
            <p>
              Author: <span>{{ uniquePost.author?.name }}</span>
            </p>
            <p>
              Created: <span>{{ toUtcDateTime(uniquePost.createdAt) }}</span>
            </p>
          </div>
          <div class="dash-info-actions">
            <button
              class="button"
              type="button"
              @click="
                modalCurrentStatus = 'report';
                modalTargetUserId = uniquePost.author?.id;
                reportData.referenceId = uniquePost.id;
                reportData.type = 'POST';
              "
            >
              <SpriteIcon
                name="report"
                size="24"
                color="#535353"
                title="Report comment"
              />
            </button>
            <button
              class="button"
              type="button"
              @click="
                modalCurrentStatus = uniquePost.isRestrictedByMe
                  ? 'unrestrict'
                  : 'restrict';
                modalTargetUserId = uniquePost.author?.id;
              "
            >
              <SpriteIcon
                name="restrict"
                size="24"
                color="#535353"
                title="Restrict"
              />
            </button>
          </div>
        </div>
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
      <!-- COMMENTS -->
      <div class="post-comments">
        <h2>Comments</h2>
        <div
          class="dash-comment shadow-light"
          v-if="uniquePost.comments?.length"
        >
          <div
            class="dash-post-comment"
            v-for="comment in uniquePost.comments"
            :key="comment.id"
          >
            <div class="dash-userinfo-comment">
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
        <div class="dash-comment-empty" v-else>
          <SpriteIcon
            name="comment"
            size="28"
            color="#535353"
            title="Comments"
          />
          <p>No comments yet.</p>
        </div>
      </div>
      <!-- NEW COMMENT ON THIS POST -->
    </div>
  </div>
</template>
<style scoped></style>
