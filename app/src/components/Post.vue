<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import type { UserPost, Post } from "../types/post";

const router = useRouter();
const authStore = useAuthStore();

// LOAD POSTS
const userdata = ref<UserPost | null>(null);
const posts = ref<Post[]>([]);
async function loadPosts() {
  // CHECK IF USER IS AUTHENTICATED
  if (!authStore.token) {
    router.push("/login");
    return;
  }

  try {
    const response = await api.get("/post/my-posts");
    userdata.value = response.data;
    posts.value = response.data.posts;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}
onMounted(loadPosts);

// DISPLAY UNIQUE POST OPTIONS
const openOptionsFor = ref<number | string>("");
function displayPostOptions(postId: number | string) {
  openOptionsFor.value = openOptionsFor.value === postId ? "" : postId;
}

// DELETE POST
async function deletePost(postId: number | string) {
  try {
    await api.delete(`/post/delete/${postId}`);
    await loadPosts();
    openOptionsFor.value = "";
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
}

// EDIT AND SAVE POST
const openEditModalFor = ref<number | string>("");
const editingPost = ref<Post | null>(null);
function openEditModal(post: Post) {
  openEditModalFor.value = openEditModalFor.value === post.id ? "" : post.id;
  editingPost.value = { ...post };
}
function closeEditModal() {
  openEditModalFor.value = "";
}
async function saveEdit() {
  if (!editingPost.value) return;

  try {
    await api.put(`/post/update/${editingPost.value.id}`, {
      content: editingPost.value.content,
    });

    await loadPosts();
    closeEditModal();
  } catch (error) {
    console.error("Error saving and edit your post: ", error);
  }
}

// LIKE AND UNLIKE POST
async function likePost(postId: number | string) {
  try {
    await api.post(`/post/like/${postId}`);
    await loadPosts();
  } catch (error) {
    console.error("Error liking post: ", error);
  }
}
// async function unlikePost(postId: number | string) {
//   try {
//     await api.post(`/post/unlike/${postId}`);
//     await loadPosts();
//     console.log("Post unliked successfully");
//   } catch (error) {
//     console.error("Error unliking post: ", error);
//   }
// }

// EXPOSE LOAD POST FN TO PARENT COMPONENT
defineExpose({
  loadPosts,
});
</script>

<template>
  <div class="dash-globalposts">
    <p class="dash-title">My Posts</p>
    <div v-for="post in posts" :key="post.id" class="dash-post">
      <div class="dash-user-post">
        <div class="dash-username">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path
              d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
            />
          </svg>
          <span>
            <RouterLink :to="`/profile/${userdata?.username}`">{{
              userdata?.name || "Unknown User"
            }}</RouterLink>
          </span>
        </div>
        <div class="dash-post-opts">
          <button type="button" @click="displayPostOptions(post.id)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#C5C5C5"
            >
              <path
                d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
              />
            </svg>
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
          :class="{ 'dash-commented': post.commentsCount }"
          v-if="!post.disableComments"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path
              d="M440-400h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"
            />
          </svg>
          <span>{{ post.commentsCount || 0 }}</span>
        </button>
        <button
          type="button"
          @click="likePost(post.id)"
          :class="{ 'dash-liked': post.likesCount }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path
              d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
            />
          </svg>
          <span v-if="!post.hideLikes">{{ post.likesCount || 0 }}</span>
        </button>
        <button
          type="button"
          :class="{ 'dash-shared': post.sharesCount }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path
              d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"
            />
          </svg>
          <span>{{ post.sharesCount || 0 }}</span>
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
            <button type="button" @click="closeEditModal()">Cancel</button>
            <button type="button" @click="saveEdit()">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-title {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
}
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
</style>
