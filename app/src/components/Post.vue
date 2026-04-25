<script setup lang="ts">
import { onMounted } from "vue";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// ICONS
import AvatarIcon from "../assets/icons/avatar-icon.vue";
import SpriteIcon from "./SpriteIcon.vue";

// POST FUNCTIONS
const {
  // VARIABLES
  userdata,
  openOptionsFor,
  openEditModalFor,
  editingPost,
  editingComment,

  // POST FUNCTIONS
  loadPosts,
  deletePost,
  saveEdit,
  likePost,
  newComment,
  editComment,
  deleteComment,

  // OPTION MODALS
  displayPostOptions,
  openEditModal,
  closeEditModal,
  toggleCommentInput,
  toggleCommentActions,
  startEditComment,

  // HELPER FUNCTIONS
  toUtcDateTime,
  isAuthorComment,
} = usePosts();

onMounted(() => {
  loadPosts("my-posts");
});

// EXPOSE LOAD POST FN TO PARENT COMPONENT
defineExpose({
  loadPosts,
  saveEdit,
});
</script>

<template>
  <div v-for="post in userdata" :key="post.id" class="dash-post">
    <div class="dash-user-post">
      <div class="dash-username">
        <AvatarIcon />
        <span>
          <RouterLink :to="`/profile/${post.author.username}`">{{
            post.author.name || "Unknown User"
          }}</RouterLink>
        </span>
      </div>
      <div class="dash-post-opts">
        <button type="button" @click="displayPostOptions(post.id)">
          <SpriteIcon name="dots" size="18" title="Post options" />
        </button>
        <div class="dash-pop-delete" v-if="openOptionsFor === post.id">
          <button type="button" @click="deletePost(post.id)">Delete</button>
          <button type="button" @click="openEditModal(post)">Edit</button>
        </div>
      </div>
    </div>
    <div class="dash-content-post">
      <p>{{ post.content }}</p>
    </div>
    <div class="dash-options-post">
      <button
        type="button"
        :class="{ 'dash-commented': post._count.comments }"
        v-if="!post.disableComments"
        @click="toggleCommentInput(post.id)"
      >
        <SpriteIcon name="comment" size="16" title="Comments" />
        <span>{{ post._count.comments || 0 }}</span>
      </button>
      <button
        type="button"
        @click="likePost(post.id)"
        :class="{ 'dash-liked': post._count.likes }"
      >
        <SpriteIcon name="heart" size="16" title="Likes" />
        <span v-if="!post.hideLikes">{{ post._count.likes || 0 }}</span>
      </button>
      <button type="button" :class="{ 'dash-shared': post._count.shares }">
        <SpriteIcon name="share" size="16" title="Shares" />
        <span>{{ post._count.shares || 0 }}</span>
      </button>
    </div>
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
              <RouterLink :to="`/profile/${comment.author.id}`">{{
                comment.author.name
              }}</RouterLink>
            </span>
          </div>
          <div
            class="dash-usercmt-actions"
            v-if="isAuthorComment(comment.author.id)"
          >
            <button
              type="button"
              v-if="editingComment.openCommentActions === comment.id"
              @click="startEditComment(comment.id, comment.content)"
            >
              <SpriteIcon name="edit" size="20" title="Edit comment" />
            </button>
            <button
              type="button"
              v-if="editingComment.openCommentActions === comment.id"
              @click="deleteComment(comment.id, post.id)"
            >
              <SpriteIcon name="trash" size="20" title="Delete comment" />
            </button>
            <button type="button" @click="toggleCommentActions(comment.id)">
              <SpriteIcon name="dots" size="18" title="Comment options" />
            </button>
          </div>
        </div>
        <div
          v-if="editingComment.editingCommentId === comment.id"
          class="dash-edit-comment"
        >
          <input type="text" v-model="editingComment.editedCommentContent" />
          <div class="dash-edit-comment-actions">
            <button type="button" @click="editComment(comment.id, post.id)">
              Save
            </button>
            <button
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
      <button type="button" @click="newComment(post.id)">Post</button>
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
          <button type="button" @click="closeEditModal()">Cancel</button>
          <button type="button" @click="saveEdit()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-post {
  background-color: #ffffff;
  padding: 0.8rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.dash-user-post {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dash-username {
  display: inherit;
  justify-content: start;
  align-items: center;
}

.dash-post-opts {
  position: relative;
  display: inherit;
  justify-content: end;
  align-items: center;
}
.dash-post-opts button {
  background: transparent;
  border: none;
  display: inherit;
  padding: 0;
  cursor: pointer;
}
.dash-post-opts button svg {
  margin: 0;
}
.dash-pop-delete {
  position: absolute;
  top: -15px;
  width: 100px;
  border-radius: 10px;
  background-color: #ffffff;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #d6d6d6;
  margin: 2rem 0 0 0;
}
.dash-pop-delete button {
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  padding: 0.3rem;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}
.dash-pop-delete button:hover {
  background-color: #eeeeee;
}

.dash-user-post svg {
  height: 18px;
  width: 18px;
  margin-right: 0.5rem;
  fill: #006145;
}
.dash-user-post span {
  font-family: "Montserrat SemiBold", sans-serif;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
}
.dash-user-post span a {
  text-decoration: none;
  color: #006145;
}
.dash-content-post {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  padding: 0.5rem;
}

.dash-options-post {
  display: flex;
  flex-direction: row;
}
.dash-options-post button {
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 0.5rem;
  cursor: pointer;
}
.dash-options-post svg {
  height: 14px;
  width: 14px;
  margin-right: 0.3rem;
  fill: #535353;
}
.dash-options-post span {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.7rem;
}

.dash-liked svg {
  fill: #c31010;
}
.dash-shared svg {
  fill: #005261;
}
.dash-commented svg {
  fill: #006145;
}

.edit-post-modal {
  background-color: #fafafa;
  padding: 1.5rem;
  margin-top: 1rem;
}
.edit-post-modal h2 {
  padding: 0;
  margin: 0;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
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
  background: transparent;
  padding: 0.2rem;
  width: 4rem;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
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
  margin-right: 0.5rem;
  fill: #006145;
}
.dash-username-comment span a {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.75rem;
  color: #006145;
  text-decoration: none;
}
.dash-usercmt-info {
  display: flex;
  align-items: center;
}
.dash-username-comment button {
  background: none;
  display: flex;
  border: none;
  outline: none;
  padding: 0;
  cursor: pointer;
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
  border: none;
  outline: none;
  color: #006145;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
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
  border: none;
  outline: none;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
  color: #006145;
  padding: 0;
  padding-right: 1rem;
  cursor: pointer;
}
.dash-edit-comment button:nth-child(2) {
  color: #535353;
}
</style>
