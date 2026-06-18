<script setup lang="ts">
// VUE
import { ref, onMounted, onUnmounted } from "vue";

// COMPONENTS
import Modal from "./Modal.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData.ts";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts.ts";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/post.css";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  modalCurrentStatus,
  modalTargetUserId,
  reportData,

  // FUNCTIONS
  selectedUser,
  getUserRoute,
  loadSelectedUser,
} = useUserData();

// POST FUNCTIONS
const {
  // VARIABLES
  userdata,
  selectedPostId,
  openOptionsFor,
  openEditModalFor,
  openCommentOptions,
  closeCommentOptions,
  editingPost,
  editingComment,
  loadingPosts,
  hasMore,
  currentRoute,
  loadPosts,

  // POST FUNCTIONS
  deletePost,
  saveEdit,
  likePost,
  newComment,
  editComment,
  deleteComment,
  repost,

  // OPTION MODALS
  displayPostOptions,
  openEditModal,
  closeEditModal,
  toggleCommentInput,
  toggleCommentOptions,
  toggleCommentActions,
  startEditComment,

  // HELPER FUNCTIONS
  toUtcDateTime,
  isAuthorComment,
  isAuthorPost,
  validatePostOwnership,
} = usePosts();

// INFINITE SCROLL SNTINELL
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && currentRoute.value) {
        loadPosts(currentRoute.value);
      }
    },
    { threshold: 0.1 },
  );

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <Modal v-if="modalCurrentStatus !== 'none'" />
  <div v-for="post in userdata" :key="post.id">
    <div class="dash-post shadow-light">
      <div class="dash-user-post">
        <div class="dash-username">
          <AvatarIcon />
          <div>
            <span>
              <RouterLink
                :to="getUserRoute(post.author.username, post.author.id)"
                @click="selectedUser(post.author.id)"
              >
                {{ post.author.name }}
              </RouterLink>
            </span>
          </div>
        </div>
        <div class="dash-post-opts">
          <button
            class="button"
            type="button"
            @click="displayPostOptions(post.id)"
          >
            <SpriteIcon
              name="dots"
              size="18"
              color="#535353"
              title="Post options"
            />
          </button>
          <div
            class="dash-pop-delete shadow-light"
            v-if="openOptionsFor === post.id"
          >
            <div
              v-if="
                post.isRepost !== true && validatePostOwnership(post.author.id)
              "
            >
              <button class="button" type="button" @click="deletePost(post.id)">
                Delete
              </button>
              <button class="button" type="button" @click="openEditModal(post)">
                Edit
              </button>
            </div>
            <RouterLink
              :to="`/post/${post.id}`"
              @click="selectedPostId = post.id"
              >Go to Post</RouterLink
            >
            <button
              class="button"
              type="button"
              @click="
                modalCurrentStatus = 'report';
                modalTargetUserId = post.author.id;
                reportData.referenceId = post.id;
                reportData.type = 'POST';
              "
            >
              Report
            </button>
            <button
              class="button"
              type="button"
              @click="
                modalCurrentStatus = post.isRestrictedByMe
                  ? 'unrestrict'
                  : 'restrict';
                modalTargetUserId = post.author.id;
              "
            >
              {{ post.isRestrictedByMe ? "Unrestrict" : "Restrict" }}
            </button>
          </div>
        </div>
      </div>
      <div class="dash-content-post">
        <span>
          {{ post.content }}
        </span>
        <span v-for="mention in post.mentions" :key="mention.id">
          <RouterLink
            :to="getUserRoute(mention.username, mention.id)"
            @click="(selectedUser(mention.id), loadSelectedUser(mention.id))"
          >
            @{{ mention.username }}
          </RouterLink>
        </span>
      </div>
      <div class="dash-options-post">
        <button
          class="button"
          type="button"
          :class="{ 'dash-commented': post._count.comments }"
          :disabled="post.userRestrictedMe"
          v-if="!post.disableComments"
          @click="toggleCommentInput(post.id)"
        >
          <SpriteIcon
            name="comment"
            size="16"
            color="#535353"
            title="Comments"
          />
          <span>{{ post._count.comments || 0 }}</span>
        </button>
        <button
          class="button"
          type="button"
          @click="likePost(post.id, post.author.liked)"
          :class="{ 'dash-liked': post.author.liked }"
          :disabled="post.userRestrictedMe"
        >
          <SpriteIcon name="heart" size="16" color="#535353" title="Likes" />
          <span v-if="!post.hideLikes">{{ post._count.likes || 0 }}</span>
        </button>
        <button
          class="button"
          type="button"
          :class="{ 'dash-shared': post._count.shares }"
          :disabled="post.userRestrictedMe"
          @click="repost(post.id, post.repostedByMe)"
          v-if="isAuthorPost(post.author.id)"
        >
          <SpriteIcon name="share" size="16" color="#535353" title="Shares" />
          <span>{{ post._count.shares || 0 }}</span>
        </button>
      </div>
      <p v-if="post.isRepost === true" class="dash-repost-by">
        Reposted by
        <RouterLink
          :to="getUserRoute(post.repostedBy.username, post.repostedBy.id)"
          @click="selectedUser(post.repostedBy.id)"
        >
          {{ post.repostedBy.name }}
        </RouterLink>
      </p>
      <div
        class="dash-comments-post"
        v-if="
          editingComment.openCommentPostId === post.id &&
          (post._count.comments ?? 0) > 0
        "
      >
        <div v-for="comment in post.comments" :key="comment.createdAt">
          <div class="dash-username-comment">
            <div class="dash-usercmt-info">
              <AvatarIcon height="32px" width="32px" />
              <span>
                <RouterLink
                  :to="getUserRoute(comment.author.username, comment.author.id)"
                  @click="selectedUser(comment.author.id)"
                >
                  {{ comment.author.name }}
                </RouterLink>
              </span>
            </div>
            <div class="dash-usercmt-actions">
              <div
                class="dash-editdelete"
                v-if="isAuthorComment(comment.author.id)"
              >
                <button
                  class="button"
                  type="button"
                  v-if="editingComment.openCommentActions === comment.id"
                  @click="startEditComment(comment.id, comment.content)"
                >
                  <SpriteIcon
                    name="edit"
                    size="20"
                    color="#535353"
                    title="Edit comment"
                  />
                </button>
                <button
                  class="button"
                  type="button"
                  v-if="editingComment.openCommentActions === comment.id"
                  @click="deleteComment(comment.id, post.id)"
                >
                  <SpriteIcon
                    name="trash"
                    size="20"
                    color="#535353"
                    title="Delete comment"
                  />
                </button>
              </div>
              <div
                v-if="openCommentOptions === comment.id && closeCommentOptions"
              >
                <button
                  class="button"
                  type="button"
                  @click="
                    modalCurrentStatus = 'report';
                    modalTargetUserId = comment.author.id;
                    reportData.referenceId = comment.id;
                    reportData.type = 'COMMENT';
                  "
                >
                  <SpriteIcon
                    name="report"
                    size="18"
                    color="#535353"
                    title="Report comment"
                  />
                </button>
              </div>

              <button
                class="button"
                type="button"
                @click="
                  toggleCommentActions(comment.id);
                  toggleCommentOptions(comment.id);
                "
              >
                <SpriteIcon
                  name="dots"
                  size="18"
                  color="#535353"
                  title="Comment options"
                />
              </button>
            </div>
          </div>
          <div
            v-if="editingComment.editingCommentId === comment.id"
            class="dash-edit-comment"
          >
            <input type="text" v-model="editingComment.editedCommentContent" />
            <div class="dash-edit-comment-actions">
              <button
                class="button"
                type="button"
                @click="editComment(comment.id, post.id)"
              >
                Save
              </button>
              <button
                class="button"
                type="button"
                @click="
                  editingComment.editingCommentId = null;
                  editingComment.editedCommentContent = '';
                "
              >
                Cancel
              </button>
            </div>
          </div>
          <p v-else>{{ comment.content }}</p>
          <p>{{ toUtcDateTime(comment.createdAt) }}</p>
        </div>
      </div>
      <div
        class="dash-new-comment-post"
        v-if="editingComment.openCommentPostId === post.id"
      >
        <input
          type="text"
          name="post-comment"
          id="post-comment"
          placeholder="Add a comment..."
          v-model="editingComment.postComment"
        />
        <button class="button" type="button" @click="newComment(post.id)">
          Post
        </button>
      </div>
      <div
        class="edit-post-modal"
        v-if="openEditModalFor === post.id && editingPost"
      >
        <h2 class="edit-title">Edit Post</h2>
        <div class="edit-post">
          <textarea
            name="text"
            id="text"
            v-model="editingPost.content"
          ></textarea>
          <div class="edit-actions">
            <button class="button" type="button" @click="closeEditModal()">
              Cancel
            </button>
            <button class="button" type="button" @click="saveEdit(post.id)">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SENTINEL | INFINITE SCROLL -->
  <div ref="sentinel" class="scroll-sentinel">
    <span v-if="loadingPosts">Loading...</span>
    <span v-else-if="currentRoute && hasMore[currentRoute] === false">
      You've reached the end of the feed, Go back to read a book instead.
    </span>
  </div>
</template>

<style scoped>
.edit-post-modal {
  background-color: #fafafa;
  padding: 1.5rem;
  margin-top: 1rem;
}
.edit-post textarea {
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  height: 3rem;
  border: none;
  resize: none;
  outline: none;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  padding: 0.7rem 0;
}
.edit-actions {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}
.edit-actions button {
  border: 1px solid #006145;
  color: #006145;
  padding: 0.2rem;
  width: 4rem;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.7rem;
}
.edit-actions button:first-child {
  color: #626262;
  border: 1px solid #626262;
}

.dash-username-comment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}
.dash-username-comment svg {
  margin-right: var(--spacing-sm);
  fill: var(--color-primary);
}
.dash-username-comment span a {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.75rem;
  color: var(--color-primary);
  text-decoration: none;
}
.dash-usercmt-info {
  display: flex;
  align-items: center;
}
.dash-username-comment button {
  background: none;
  display: flex;
  outline: none;
  padding: 0;
}
.dash-username-comment button > svg {
  margin: 0;
}

.dash-comments-post,
.dash-new-comment-post {
  margin: 1.5rem 2rem 1rem 2rem;
  border-top: 2px solid #f9f9f9;
}
.dash-new-comment-post {
  padding-top: 0.5rem;
  display: flex;
  align-items: center;
}
.dash-comments-post,
.dash-new-comment-post {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.75rem;
}
.dash-new-comment-post input {
  box-sizing: border-box;
  width: 100%;
  border: none;
  outline: none;
  background: none;
}
.dash-new-comment-post button {
  background: none;
  outline: none;
  color: #006145;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
}
.dash-editdelete {
  display: inherit;
  gap: 0.5rem;
}
.dash-usercmt-actions svg {
  fill: #535353;
}
.dash-usercmt-actions button:hover > svg {
  fill: #006145;
}
.dash-comments-post div > p:nth-child(3) {
  font-size: 0.65rem;
}

.dash-usercmt-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.dash-edit-comment input {
  width: 100%;
  box-sizing: border-box;
  margin: 1rem 0;
  border: none;
  outline: none;
  background: none;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.75rem;
}
.dash-edit-comment button {
  background: none;
  outline: none;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
  color: #006145;
  padding: 0;
  padding-right: 1rem;
}
.dash-edit-comment button:nth-child(2) {
  color: #535353;
}

.dash-repost-by {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.75rem;
  margin: 0;
  text-align: right;
}

.scroll-sentinel {
  text-align: center;
  padding: 1rem;
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  color: var(--color-primary);
}
</style>
