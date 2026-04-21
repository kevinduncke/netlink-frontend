// VUE
import { reactive, ref } from "vue";

// SERVICES, STORES AND ROUTES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { router } from "../router";

// TYPES
import type {
  PostType,
  Comment,
  EditingComment,
  CreatePost,
} from "../types/types.ts";

// POSTS
export const userdata = ref<PostType[]>([]);

export function usePosts() {
  const authStore = useAuthStore();

  // CREATE POST
  const createPostData: CreatePost = reactive({
    content: "What's on your mind today?",
    mentions: [],
    location: "",
    imageUrl: "",
    visibility: "PUBLIC",
    specificFollowers: [],
    hideLikes: false,
    disableComments: false,
    showMentionModal: false,
    showSpecificModal: false,
  });

  // POST COMPONENT OPTIONS
  const openOptionsFor = ref<number | string>("");
  const openEditModalFor = ref<number | string>("");

  // EDIT POST
  const editingPost = ref<PostType | null>(null);

  // EDIT COMMENT
  const editingComment: EditingComment = reactive({
    postComment: "",
    editedCommentContent: "",
    openCommentPostId: null as number | string | null,
    editingCommentId: null as number | string | null,
    openCommentActions: null as number | string | null,
  });

  // CREATE POST
  async function createPost() {
    try {
      await api.post("/post/", {
        content: createPostData.content,
        visibility: createPostData.visibility,
        specificTo: createPostData.specificFollowers,
        location: createPostData.location,
        imageUrl: createPostData.imageUrl,
        hideLikes: createPostData.hideLikes,
        disableComments: createPostData.disableComments,
      });

      createPostData.content = "";
      createPostData.mentions = [];
      createPostData.visibility = "PUBLIC";
      createPostData.specificFollowers = [];
      createPostData.location = "";
      createPostData.imageUrl = "";
      createPostData.hideLikes = false;
      createPostData.disableComments = false;
      // COMMENT, LIKE AND SHARE COUNT => 0
      // AUTHOR INFO => CURRENT USER

      // LOAD NEW POST LOCALLY
      loadPosts("my-posts");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // LOAD POST
  async function loadPosts(route: string) {
    // CHECK IF USER IS AUTHENTICATED
    if (!authStore.token) {
      router.push("/login");
      return;
    }
    try {
      const response = await api.get(`/post/${route}`);

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

  // DELETE POST                                          [[ RE-LOAD LOCALLY ]]
  async function deletePost(postId: number | string) {
    try {
      await api.delete(`/post/delete/${postId}`);

      // REMOVE POST LOCALLY
      openOptionsFor.value = "";
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  }

  // SAVE EDITED POST                                     [[ RE-LOAD LOCALLY ]]
  async function saveEdit() {
    if (!editingPost.value) return;

    try {
      await api.put(`/post/update/${editingPost.value.id}`, {
        content: editingPost.value.content,
      });

      // LOAD EDITED POST LOCALLY
      closeEditModal();
    } catch (error) {
      console.error("Error saving and edit your post: ", error);
    }
  }

  // LIKE POST                                            [[ RE-LOAD LOCALLY ]]
  async function likePost(postId: number) {
    try {
      await api.post(`/post/like/${postId}`);

      // UPDATE LIKE COUNT LOCALLY
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  }

  // LOAD COMMENTS
  async function loadComments(postId: number | string) {
    try {
      const response = await api.get(`/post/comments/all/${postId}`);
      const comments: Comment[] = response.data?.comments || [];

      const post = userdata.value.find((p) => p.id === postId);

      if (!post) return;

      post.comments = comments;
    } catch (error) {
      console.error("Error loading comments: ", error);
    }
  }

  // NEW COMMENT
  async function newComment(postId: number | string) {
    try {
      if (!editingComment.postComment.trim()) return;

      const response = await api.post(`/post/comment/${postId}`, {
        content: editingComment.postComment,
      });

      const newCommentData: Comment = response.data;

      // UPDATE COMMENT LOCALLY AND PUSH NEW COMMENT TO THE TOP
      const selectedPost = userdata.value.find((p) => p.id === postId);

      if (selectedPost) {
        if (!selectedPost.comments) {
          selectedPost.comments = [newCommentData];
        } else {
          selectedPost.comments.unshift(newCommentData);
        }
        selectedPost._count.comments = selectedPost._count.comments
          ? selectedPost._count.comments + 1
          : 1;
      }

      editingComment.postComment = "";
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
      if (!editingComment.editedCommentContent.trim()) return;

      await api.put(`/post/comment/${commentId}`, {
        content: editingComment.editedCommentContent,
        createdAt: new Date().toISOString(),
      });

      // UPDATE COMMENT LOCALLY
      const selectedPost = userdata.value.find((p) => p.id === postId);

      if (selectedPost) {
        const selectedComment = selectedPost.comments?.find(
          (comment) => comment.id === commentId,
        );

        if (selectedComment) {
          selectedComment.content = editingComment.editedCommentContent;
        }
      }

      editingComment.editingCommentId = null;
      editingComment.editedCommentContent = "";
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
      const selectedPost = userdata.value.find((p) => p.id === postId);

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
  function openEditModal(post: PostType) {
    openEditModalFor.value = openEditModalFor.value === post.id ? "" : post.id;
    editingPost.value = { ...post };
  }
  function closeEditModal() {
    openEditModalFor.value = "";
  }
  function toggleCommentInput(postId: number | string) {
    editingComment.openCommentPostId =
      editingComment.openCommentPostId === postId ? null : postId;
    loadComments(postId);
  }
  function toggleCommentActions(commentId: number | string) {
    editingComment.openCommentActions =
      editingComment.openCommentActions === commentId ? null : commentId;
  }
  function startEditComment(commentId: number | string, content: string) {
    editingComment.editingCommentId = commentId;
    editingComment.editedCommentContent = content;
    editingComment.openCommentActions = null;
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

  function addMention() {
    createPostData.showMentionModal = true;
  }
  function selectMention(username: string) {
    createPostData.content += " @" + username + " ";
    createPostData.showMentionModal = false;
  }
  function addSpecificFollowers(selectedList: string[]) {
    const set = new Set([...createPostData.specificFollowers, ...selectedList]);
    createPostData.specificFollowers = Array.from(set);
    createPostData.showSpecificModal = false;
  }
  function addLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        createPostData.location = `${latitude}, ${longitude}`;
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve location.");
      },
    );
  }
  function changeVisibility(mode: CreatePost["visibility"]) {
    createPostData.visibility = mode;
    switch (mode) {
      case "PUBLIC":
        createPostData.visibility = "PUBLIC";
        break;
      case "FOLLOWERS":
        createPostData.visibility = "FOLLOWERS";
        break;
      case "ONLY_ME":
        createPostData.visibility = "ONLY_ME";
        break;
      case "SPECIFIC":
        createPostData.visibility = "SPECIFIC";
        break;
      default:
        createPostData.visibility = "PUBLIC";
    }
    if (mode === "SPECIFIC") {
      createPostData.showSpecificModal = true;
    }
  }
  function toggleHideLikes() {
    createPostData.hideLikes = !createPostData.hideLikes;
  }
  function toggleDisableComments() {
    createPostData.disableComments = !createPostData.disableComments;
  }

  return {
    // VARIABLES
    userdata,
    createPostData,
    openOptionsFor,
    openEditModalFor,
    editingPost,
    editingComment,

    // CREATE POST FUNCTIONS
    createPost,
    addMention,
    addLocation,
    selectMention,
    addSpecificFollowers,

    // POST FUNCTIONS
    loadPosts,
    deletePost,
    saveEdit,
    likePost,

    // COMMENTS FUNCTIONS
    loadComments,
    newComment,
    editComment,
    deleteComment,

    // OPTION MODALS
    displayPostOptions,
    openEditModal,
    closeEditModal,
    changeVisibility,
    toggleHideLikes,
    toggleDisableComments,
    toggleCommentInput,
    toggleCommentActions,
    startEditComment,

    // HELPER FUNCTIONS
    toUtcDateTime,
    isAuthorComment,
  };
}
