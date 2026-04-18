<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import Navigation from "./Navigation.vue";
import type { FollowUser } from "../types/users";
import type { SearchFavoriteUser } from "../types/search";
import type { FollowingPost, FavoritePost } from "../types/post";
import type { Comment } from "../types/comment";

const router = useRouter();
const authStore = useAuthStore();

// FAVORITES AND LASTEST POSTS
const favSearchQuery = ref<string>("");
const favStateEdit = ref<boolean>(false);

const latestPosts = ref<FollowingPost[]>([]);
const favUsersPosts = ref<FavoritePost[]>([]);
const favoriteUsers = ref<FollowUser[]>([]);
const suggestedUsers = ref<FollowUser[]>([]);

async function loadLatestPosts() {
  try {
    const response = await api.get("/post/following");
    latestPosts.value = response.data.posts;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}
async function loadFavoriteUsersPosts() {
  try {
    const response = await api.get("/favorites/posts");
    favUsersPosts.value = response.data.posts;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}
async function likePost(postId: number | string) {
  try {
    await api.post(`/post/like/${postId}`);
    await loadFavoriteUsersPosts();
  } catch (error) {
    console.error("Error liking post: ", error);
  }
}
async function searchFavoriteUsers(query: string) {
  try {
    const response = await api.get("/favorites/search", {
      params: { q: query },
    });

    const users: SearchFavoriteUser[] = response.data.users || [];
    favoriteUsers.value = users.filter((u) => u.isFavorite);
    suggestedUsers.value = users.filter((u) => !u.isFavorite);
  } catch (error) {
    console.error("Error searching favorite users: ", error);
  }
}
async function loadFavoriteUsers() {
  try {
    const response = await api.get("/favorites");
    favoriteUsers.value = response.data.users;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}
async function removeAllFavoriteUsers() {
  try {
    await api.delete("/favorites/all");
    await loadFavoriteUsers();
    await loadSuggestedUsers();
  } catch (error) {
    console.log("Error removing all favorite users: ", error);
  }
}
async function deleteFavoriteUser(userId: string | number) {
  try {
    await api.delete(`/favorites/${userId}`);
    await loadFavoriteUsers();
    await loadSuggestedUsers();
    await loadFavoriteUsersPosts();
  } catch (error) {
    console.log("Error deleting favorite user: ", error);
  }
}
async function loadSuggestedUsers() {
  try {
    const response = await api.get("/favorites/suggested");
    suggestedUsers.value = response.data.users;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}
async function addFavoriteUser(userId: string | number) {
  try {
    await api.post(`/favorites/${userId}`);
    await loadSuggestedUsers();
    await loadFavoriteUsers();
    await loadFavoriteUsersPosts();
  } catch (error) {
    console.error("Error adding favorite user: ", error);
  }
}

// LOAD COMMENTS FOR A POST
const postComment = ref<string>("");
const openCommentPostId = ref<number | string | null>(null);
const openCommentActions = ref<number | string | null>(null);
const editedCommentContent = ref<string>("");
const editingCommentId = ref<number | string | null>(null);

async function loadComments(postId: number | string) {
  try {
    const response = await api.get(`/post/comments/all/${postId}`);
    const comments: Comment[] = response.data?.comments || [];

    const selectedPost =
      latestPosts.value.find((p) => p.id === postId) ||
      favUsersPosts.value.find((p) => p.id === postId);

    if (selectedPost) {
      selectedPost.comments = comments;
    }
  } catch (error) {
    console.error("Error loading comments: ", error);
  }
}
async function newComment(postId: number | string) {
  try {
    if (!postComment.value.trim()) return;

    await api.post(`/post/comment/${postId}`, {
      content: postComment.value,
    });

    postComment.value = "";
    await loadFavoriteUsersPosts();
    await loadLatestPosts();
    await loadComments(postId);
  } catch (error) {
    console.error("Error commenting on post: ", error);
  }
}
function toggleCommentInput(postId: number | string) {
  openCommentPostId.value = openCommentPostId.value === postId ? null : postId;
  openCommentActions.value = null;
  loadComments(postId);
}
function toUtcDateTime(date: string): string {
  if (!date) return "";

  const utcDate = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(utcDate);
}
function toggleCommentActions(commentId: number | string) {
  openCommentActions.value =
    openCommentActions.value === commentId ? null : commentId;
}
function startEditComment(commentId: number | string, content: string) {
  editingCommentId.value = commentId;
  editedCommentContent.value = content;
  openCommentActions.value = null;
}
// CHECK IF USER COMMENT ID IS THE SAME AS THE USER LOGGED IN
function isAuthorComment(commentAuthorId: number | string): boolean {
  const currentUser = authStore.user as {
    id?: number | string;
    userId?: number | string;
  } | null;
  const currentUserId = currentUser?.id ?? currentUser?.userId;

  if (!currentUserId) return false;
  return String(commentAuthorId) === String(currentUserId);
}
async function deleteComment(
  commentId: number | string,
  postId: number | string,
) {
  try {
    await api.delete(`/post/comment/${commentId}`);

    // REMOVE COMMENT LOCALLY
    const selectedPost =
      latestPosts.value.find((p) => p.id === postId) ||
      favUsersPosts.value.find((p) => p.id === postId);

    if (selectedPost) {
      selectedPost.comments = selectedPost.comments?.filter(
        (c) => c.id !== commentId,
      );
      selectedPost._count.comments = selectedPost._count.comments
        ? selectedPost._count.comments - 1
        : 0;
    }
  } catch (error) {
    console.error("Error deleting comment: ", error);
  }
}
async function editComment(
  commentId: number | string,
  postId: number | string,
) {
  try {
    if (!editedCommentContent.value.trim()) return;

    await api.put(`/post/comment/${commentId}`, {
      content: editedCommentContent.value,
      createdAt: new Date().toISOString(),
    });

    // UPDATE COMMENT LOCALLY, HERE HERE
    const selectedPost =
      latestPosts.value.find((p) => p.id === postId) ||
      favUsersPosts.value.find((p) => p.id === postId);

    if (selectedPost) {
      const selectedComment = selectedPost.comments?.find(
        (comment) => comment.id === commentId,
      );

      if (selectedComment) {
        selectedComment.content = editedCommentContent.value;
      }
    }

    editingCommentId.value = null;
    editedCommentContent.value = "";
  } catch (error) {
    console.error("Error editing comment: ", error);
  }
}

watch(favSearchQuery, (newQuery) => {
  if (newQuery.trim() === "") {
    loadFavoriteUsers();
    loadSuggestedUsers();
  } else {
    searchFavoriteUsers(newQuery);
  }
});
onMounted(async () => {
  await loadFavoriteUsers();
  await loadSuggestedUsers();
  await loadFavoriteUsersPosts();
  await loadLatestPosts();
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-fav-base">
        <div class="fav-head">
          <h2>Favorites</h2>
          <button type="button" @click="favStateEdit = !favStateEdit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#e3e3e3"
            >
              <path
                d="M288-600v-72h528v72H288Zm0 156v-72h528v72H288Zm0 156v-72h528v72H288ZM180-600q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-636q0 14-10.35 25T180-600Zm0 156q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-480q0 14-10.35 25T180-444Zm0 156q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-324q0 14-10.35 25T180-288Z"
              />
            </svg>
          </button>
        </div>
        <div
          class="fav-users"
          v-if="!favStateEdit"
          v-for="post in favUsersPosts"
          :key="post.id"
        >
          <div class="fav-head-post">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#535353"
            >
              <path
                d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
              />
            </svg>
            <div>
              <p>{{ post.author.name }}</p>
              <p>@{{ post.author.username }}</p>
            </div>
          </div>
          <p>{{ post.content }}</p>
          <div class="fav-foot-post">
            <div class="fav-foot-actions">
              <button
                type="button"
                :class="{ 'fav-commented': post._count.comments > 0 }"
                v-if="!post.disableComments"
                @click="toggleCommentInput(post.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#535353"
                >
                  <path
                    d="M440-400h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"
                  />
                </svg>
                <span>{{ post._count.comments }}</span>
              </button>
              <button
                type="button"
                :class="{ 'fav-liked': post._count.likes > 0 }"
                @click="likePost(post.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#535353"
                >
                  <path
                    d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
                  />
                </svg>
                <span v-if="!post.hideLikes">{{ post._count.likes }}</span>
              </button>
              <button
                type="button"
                :class="{ 'fav-shared': post._count.shares > 0 }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#535353"
                >
                  <path
                    d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"
                  />
                </svg>
                <span>{{ post._count.shares }}</span>
              </button>
            </div>
            <button type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="#535353"
              >
                <path
                  d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"
                />
              </svg>
            </button>
          </div>
          <div
            class="dash-comments-post"
            v-if="openCommentPostId === post.id && post._count.comments > 0"
          >
            <div v-for="comment in post.comments" :key="comment.createdAt">
              <div class="dash-username-comment">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="#000000"
                >
                  <path
                    d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
                  />
                </svg>
                <span>
                  <RouterLink :to="`/profile/${comment.author.id}`">{{
                    comment.author.name
                  }}</RouterLink>
                </span>
              </div>
              <p>{{ comment.content }}</p>
              <p>{{ toUtcDateTime(comment.createdAt) }}</p>
            </div>
          </div>
          <div
            class="dash-new-comment-post"
            v-if="openCommentPostId === post.id"
          >
            <input
              type="text"
              name="post-comment"
              id="post-comment"
              placeholder="Add a comment..."
              v-model="postComment"
            />
            <button type="button" @click="newComment(post.id)">Post</button>
          </div>
        </div>
        <div class="dash-fav-edit" v-else>
          <div class="fav-edit-search">
            <input
              type="search"
              name="search"
              id="fav-search"
              placeholder="Search"
              v-model="favSearchQuery"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#e3e3e3"
            >
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
              />
            </svg>
          </div>
          <div class="fav-edit-favorites" v-if="favoriteUsers.length > 0">
            <div class="fav-edit-listhead">
              <p>Users</p>
              <button type="button" @click="removeAllFavoriteUsers()">
                Remove all
              </button>
            </div>
            <div class="fav-edit-users">
              <div
                class="fav-user"
                v-for="user in favoriteUsers"
                :key="user.id"
              >
                <div class="fav-user-data">
                  <div class="fav-user-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"
                      />
                    </svg>
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button type="button" @click="deleteFavoriteUser(user.id)">
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div class="fav-add-suggestions">
            <p>Suggestions</p>
            <div class="fav-add-users">
              <div
                class="fav-user"
                v-for="user in suggestedUsers"
                :key="user.id"
              >
                <div class="fav-user-data">
                  <div class="fav-user-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"
                      />
                    </svg>
                  </div>
                  <div class="fav-user-names">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                  </div>
                </div>
                <button type="button" @click="addFavoriteUser(user.id)">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-lposts">
        <h2>Lastest Posts</h2>
        <div
          class="fav-users"
          v-if="!favStateEdit"
          v-for="post in latestPosts"
          :key="post.id"
        >
          <div class="fav-head-post">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#535353"
            >
              <path
                d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
              />
            </svg>
            <div>
              <p>{{ post.author.name }}</p>
              <p>@{{ post.author.username }}</p>
            </div>
          </div>
          <p>{{ post.content }}</p>
          <div class="fav-foot-post">
            <div class="fav-foot-actions">
              <button
                type="button"
                :class="{ 'fav-commented': post._count.comments > 0 }"
                v-if="!post.disableComments"
                @click="toggleCommentInput(post.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#535353"
                >
                  <path
                    d="M440-400h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"
                  />
                </svg>
                <span>{{ post._count.comments }}</span>
              </button>
              <button
                type="button"
                :class="{ 'fav-liked': post._count.likes > 0 }"
                @click="likePost(post.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#535353"
                >
                  <path
                    d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
                  />
                </svg>
                <span v-if="!post.hideLikes">{{ post._count.likes }}</span>
              </button>
              <button
                type="button"
                :class="{ 'fav-shared': post._count.shares > 0 }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#535353"
                >
                  <path
                    d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"
                  />
                </svg>
                <span>{{ post._count.shares }}</span>
              </button>
            </div>
            <button type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="#535353"
              >
                <path
                  d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"
                />
              </svg>
            </button>
          </div>
          <div
            class="dash-comments-post"
            v-if="openCommentPostId === post.id && post._count.comments > 0"
          >
            <div v-for="comment in post.comments" :key="comment.createdAt">
              <div class="dash-username-comment">
                <div class="dash-usercmt-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="#000000"
                  >
                    <path
                      d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
                    />
                  </svg>
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
                    v-if="openCommentActions === comment.id"
                    @click="startEditComment(comment.id, comment.content)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    v-if="openCommentActions === comment.id"
                    @click="deleteComment(comment.id, post.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="m400-325 80-80 80 80 51-51-80-80 80-80-51-51-80 80-80-80-51 51 80 80-80 80 51 51Zm-88 181q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480Zm-336 0v480-480Z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="toggleCommentActions(comment.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#e3e3e3"
                    >
                      <path
                        d="M479.79-192Q450-192 429-213.21t-21-51Q408-294 429.21-315t51-21Q510-336 531-314.79t21 51Q552-234 530.79-213t-51 21Zm0-216Q450-408 429-429.21t-21-51Q408-510 429.21-531t51-21Q510-552 531-530.79t21 51Q552-450 530.79-429t-51 21Zm0-216Q450-624 429-645.21t-21-51Q408-726 429.21-747t51-21Q510-768 531-746.79t21 51Q552-666 530.79-645t-51 21Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                v-if="editingCommentId === comment.id"
                class="dash-edit-comment"
              >
                <input type="text" v-model="editedCommentContent" />
                <div class="dash-edit-comment-actions">
                  <button
                    type="button"
                    @click="editComment(comment.id, post.id)"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    @click="
                      editingCommentId = null;
                      editedCommentContent = '';
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
            v-if="openCommentPostId === post.id"
          >
            <input
              type="text"
              name="post-comment"
              id="post-comment"
              placeholder="Add a comment..."
              v-model="postComment"
            />
            <button type="button" @click="newComment(post.id)">Post</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  grid-template-rows: 100vh;
}
.dash-navside,
.dash-sidepanel,
.dash-content {
  padding: 10px 20px;
}

.dash-sidepanel {
  background-color: #ffffff;
  color: #000000;
  overflow-y: auto;
}

.fav-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.fav-head h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.fav-head button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
.fav-head button:hover svg {
  fill: #006145;
}

.fav-head-post {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
}
.fav-head-post p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  margin: 0.2rem !important;
}

.fav-users {
  background-color: #fbfbfb;
  padding: 0.8rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.fav-users p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  margin: 1rem 0;
}

.fav-foot-post {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.fav-foot-post button {
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
.fav-foot-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.fav-foot-actions button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.3rem;
}
.fav-foot-actions span {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.7rem;
}
.fav-foot-actions button:nth-child(1):hover svg {
  fill: #006145;
}
.fav-foot-actions button:nth-child(2):hover svg {
  fill: #c31010;
}
.fav-foot-actions button:nth-child(3):hover svg {
  fill: #005261;
}

.fav-liked svg {
  fill: #c31010;
}
.fav-shared svg {
  fill: #005261;
}
.fav-commented svg {
  fill: #006145;
}

.fav-edit-search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fbfbfb;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  border-radius: 10px;
}
.fav-edit-search input {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  color: #535353;
}

.fav-edit-listhead {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}
.fav-edit-listhead p,
.fav-add-suggestions p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}
.fav-edit-listhead button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: #005261;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}

.fav-edit-users,
.fav-add-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.fav-user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.fav-user button {
  background: #f1f1f1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
}
.fav-user button:hover {
  background: #e9e9e9;
}
.fav-user-data {
  display: inherit;
  align-items: center;
  gap: 0.5rem;
}
.fav-user-names p {
  margin: 0.3rem !important;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
}

.fav-add-suggestions {
  margin-top: 2rem;
  overflow-y: auto;
}

.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
.dash-lposts h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
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
  margin: 1.5rem 2rem 1rem 1rem;
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
