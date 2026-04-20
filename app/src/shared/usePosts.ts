// VUE
import { ref } from "vue";

// SERVICES, STORES AND ROUTES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { router } from "../router";

// TYPES
import type { Post, Comment } from "../types/types.ts";

type DashboardPosts = {
  favorites: Post[];
  following: Post[];
};

// POSTS
export const userdata = ref<Post[]>([]);
export const dashboardPosts = ref<DashboardPosts | null>(null);

export const openOptionsFor = ref<number | string>("");
export const openEditModalFor = ref<number | string>("");
export const editingPost = ref<Post | null>(null);

export const postComment = ref<string>("");
export const editedCommentContent = ref<string>("");
export const openCommentPostId = ref<number | string | null>(null);
export const editingCommentId = ref<number | string | null>(null);
export const openCommentActions = ref<number | string | null>(null);

export function usePosts() {
  const authStore = useAuthStore();

  // LOAD POST
  async function loadPosts(route: string) {
    // CHECK IF USER IS AUTHENTICATED
    if (!authStore.token) {
      router.push("/login");
      return;
    }
    try {
      const response = await api.get(`/post/${route}`);

      if (route === "dashboard/posts") {
        dashboardPosts.value = response.data;
        return;
      }

      userdata.value = response.data || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }
  // DELETE POST
  async function deletePost(postId: number | string, route: string) {
    try {
      await api.delete(`/post/delete/${postId}`);
      await loadPosts(route);
      openOptionsFor.value = "";
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  }
  // SAVE EDITED POST
  async function saveEdit(route: string) {
    if (!editingPost.value) return;

    try {
      await api.put(`/post/update/${editingPost.value.id}`, {
        content: editingPost.value.content,
      });

      await loadPosts(route);
      closeEditModal();
    } catch (error) {
      console.error("Error saving and edit your post: ", error);
    }
  }
  // LIKE POST
  async function likePost(postId: number | string, route: string) {
    try {
      await api.post(`/post/like/${postId}`);
      await loadPosts(route);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  }
  // LOAD COMMENTS
  async function loadComments(postId: number | string) {
    try {
      const response = await api.get(`/post/comments/all/${postId}`);
      const comments: Comment[] = response.data?.comments || [];

      const post =
        userdata.value.find((p) => p.id === postId) ||
        dashboardPosts.value?.favorites.find((p) => p.id === postId) ||
        dashboardPosts.value?.following.find((p) => p.id === postId);

      if (!post) return;
    
      post.comments = comments;
    } catch (error) {
      console.error("Error loading comments: ", error);
    }
  }
  // NEW COMMENT
  async function newComment(postId: number | string) {
    try {
      if (!postComment.value.trim()) return;

      const response = await api.post(`/post/comment/${postId}`, {
        content: postComment.value,
      });

      const newCommentData: Comment = response.data;

      // UPDATE COMMENT LOCALLY AND PUSH NEW COMMENT TO THE TOP
      const selectedPost =
        userdata.value.find((p) => p.id === postId) ||
        dashboardPosts.value?.favorites.find((p) => p.id === postId) ||
        dashboardPosts.value?.following.find((p) => p.id === postId);
      
      if (selectedPost) {
        if (!selectedPost.comments) {
          selectedPost.comments = [newCommentData];
        } else {
          selectedPost.comments.unshift(newCommentData);
        }
        selectedPost._count.comments = selectedPost._count.comments ? selectedPost._count.comments + 1 : 1;
      }

      postComment.value = "";
    } catch (error) {
      console.error("Error commenting on post: ", error);
    }
  }

  // EDIT COMMENT
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

      // UPDATE COMMENT LOCALLY
      const selectedPost =
        userdata.value.find((p) => p.id === postId) ||
        dashboardPosts.value?.favorites.find((p) => p.id === postId) ||
        dashboardPosts.value?.following.find((p) => p.id === postId);

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
  // DELETE COMMENT
  async function deleteComment(
    commentId: number | string,
    postId: number | string,
  ) {
    try {
      await api.delete(`/post/comment/${commentId}`);

      // REMOVE COMMENT LOCALLY
      const selectedPost =
        userdata.value.find((p) => p.id === postId) ||
        dashboardPosts.value?.favorites.find((p) => p.id === postId) ||
        dashboardPosts.value?.following.find((p) => p.id === postId);

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

  // OPTION MODALS
  function displayPostOptions(postId: number | string) {
    openOptionsFor.value = openOptionsFor.value === postId ? "" : postId;
  }
  function openEditModal(post: Post) {
    openEditModalFor.value = openEditModalFor.value === post.id ? "" : post.id;
    editingPost.value = { ...post };
  }
  function closeEditModal() {
    openEditModalFor.value = "";
  }
  function toggleCommentInput(postId: number | string) {
    openCommentPostId.value =
      openCommentPostId.value === postId ? null : postId;
    loadComments(postId);
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

  // HELPER FUNCTIONS
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
  function isAuthorComment(commentAuthorId: number | string): boolean {
    const currentUser = authStore.user as {
      id?: number | string;
      userId?: number | string;
    } | null;
    const currentUserId = currentUser?.id ?? currentUser?.userId;

    if (!currentUserId) return false;
    return String(commentAuthorId) === String(currentUserId);
  }

  return {
    loadPosts,
    deletePost,
    saveEdit,
    likePost,
    loadComments,
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
  };
}
