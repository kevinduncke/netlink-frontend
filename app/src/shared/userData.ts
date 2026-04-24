// VUE
import { ref, reactive, computed } from "vue";

// SERVICES, STORES AND ROUTES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { router } from "../router";

// TYPES
import type { FollowUser, UserChat } from "../types/users";
import type { SearchFavoriteUser, SearchUser } from "../types/search";
import type { UserProfile } from "../types/users";

// POSTS COMPOSITION + VARIABLES
import { usePosts } from "../shared/usePosts";
import type { ChatMessage, ChatUser } from "../types/chat";

export function useUserData() {
  const authStore = useAuthStore();
  const { editingComment } = usePosts();
  const {
    // VARIABLES
    userdata,

    // FUNCTIONS
    loadPosts,
  } = usePosts();
  //================================================

  // LOAD FAVORITE USERS
  const favoriteUsers = ref<FollowUser[]>([]);
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

  // SEARCH FAVORITE USERS
  const favSearchQuery = ref<string>("");
  async function searchFavoriteUsers(query: string) {
    try {
      const response = await api.get("/favorites/search", {
        params: { q: query },
      });

      const users: SearchFavoriteUser[] = response.data.users || [];
      favoriteUsers.value = users.filter((u) => u.isFavorite);
      suggestedUsers.value = users.filter((u) => !u.isFavorite);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // EDIT FAVORITE USERS
  const favStateEdit = ref<boolean>(false);

  // ADD FAVORITE USERS
  async function addFavoriteUser(userId: string | number) {
    try {
      await api.post(`/favorites/${userId}`);
      // LOAD NEW FAVORITE USERS LOCALLY
      // REMOVE OLD USER FROM SUGGESTED USERS LOCALLY
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // REMOVE FAVORITE USERS
  async function deleteFavoriteUser(userId: string | number) {
    try {
      await api.delete(`/favorites/${userId}`);
      // REMOVE OLD FAVORITE USER FROM FAVORITE USERS LOCALLY
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // REMOVE ALL FAVORITE USERS
  async function removeAllFavoriteUsers() {
    try {
      await api.delete("/favorites/all");
      await loadFavoriteUsers();
      await loadSuggestedUsers("favorites");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      console.log("Error removing all favorite users: ", error);
    }
  }

  // SUGGESTED USERS
  const suggestedUsers = ref<FollowUser[]>([]);
  async function loadSuggestedUsers(route: string) {
    try {
      let response = [] as any;
      if (route === "favorites") {
        response = await api.get("/favorites/suggested");
        suggestedUsers.value = response.data.users;
      } else if (route === "users") {
        response = await api.get("/users/suggested");
        suggestedUsers.value = response.data || [];
      } else if (route === "following") {
        response = await api.get("/follow/following");
        suggestedUsers.value = response.data || [];
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  //================================================

  // FILTER FOLLOW PANEL
  const followsFilter = ref<string>("following");

  // LOAD FOLLOWING USERS
  const followingUsers = ref<FollowUser[]>([]);
  async function loadFollowingUsers() {
    try {
      const response = await api.get("/follow/following");
      followingUsers.value = response.data;
      const firstFollowingUser = followingUsers.value[0];
      if (firstFollowingUser) {
        selectedUserId.value = firstFollowingUser.id;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // LOAD FOLLOWERS USERS
  const followersUsers = ref<FollowUser[]>([]);
  async function loadFollowersUsers() {
    try {
      followsFilter.value = "followers";
      const response = await api.get("/follow/followers");
      followersUsers.value = response.data;

      const firstFollowerUser = followersUsers.value[0];
      if (firstFollowerUser) {
        selectedUserId.value = firstFollowerUser.id;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  //================================================

  // LOAD USER PROFILE
  const userProfile = ref<UserProfile>({
    name: "",
    username: "",
    bio: "",
    url: "",
    avatarUrl: "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  async function loadUserProfile() {
    try {
      const res = await api.get(`/users/${selectedUserId.value}`);
      userProfile.value = res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // LOAD LOGGED USER PROFILE
  const originalProfile = ref({} as UserProfile);
  async function loadMyProfile() {
    try {
      const response = await api.get("/users/me");
      originalProfile.value = structuredClone(response.data);
      userProfile.value = response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // EDITING LOGGED USER PROFILE
  const editingProfile = ref({
    name: false,
    username: false,
    bio: false,
    url: false,
    avatarUrl: false,
  });
  const hasUnsavedChanges = ref(false);
  function toggleEdit(field: keyof typeof editingProfile.value) {
    editingProfile.value[field] = !editingProfile.value[field];
  }
  function toggleCloseEdit(field: keyof typeof editingProfile.value) {
    editingProfile.value[field] = false;
  }

  // SAVE LOGGED USER PROFILE
  async function saveProfile() {
    try {
      await api.patch("/users/me", {
        name: userProfile.value.name,
        username: userProfile.value.username,
        bio: userProfile.value.bio,
        url: userProfile.value.url,
        avatarUrl: userProfile.value.avatarUrl,
      });

      editingProfile.value = {
        name: false,
        username: false,
        bio: false,
        url: false,
        avatarUrl: false,
      };

      originalProfile.value = {
        ...originalProfile.value,
        name: userProfile.value.name,
        username: userProfile.value.username,
        bio: userProfile.value.bio,
        url: userProfile.value.url,
        avatarUrl: userProfile.value.avatarUrl,
      };
      hasUnsavedChanges.value = false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // DELETE LOGGED USER ACCOUNT
  async function deleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await api.delete("users/me");
      authStore.logout();
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  //================================================

  // SEARCH POSTS
  const searchFilters = reactive({
    query: "",
    people: "anyone",
    shared: "all",
    fromDate: "",
    toDate: "",
  });
  let latestSearchRequestId = 0;
  async function searchPost(filters = searchFilters) {
    try {
      const requestId = ++latestSearchRequestId;
      const hasActiveFilters =
        filters.people !== "anyone" ||
        filters.shared !== "all" ||
        !!filters.fromDate ||
        !!filters.toDate;

      if (!filters.query.trim() && !hasActiveFilters) {
        await loadPosts("all");
        return;
      }

      const params = new URLSearchParams({
        query: filters.query,
        people: filters.people,
        shared: filters.shared,
        fromDate: toUtcStartOfDay(filters.fromDate),
        toDate: toUtcEndOfDay(filters.toDate),
      });

      const response = await api.get(`/post/search?${params.toString()}`);
      if (requestId !== latestSearchRequestId) {
        return;
      }

      userdata.value = response.data.posts || [];
    } catch (error) {
      console.error("Error searching posts: ", error);
    }
  }
  function resetFilters() {
    searchFilters.query = "";
    searchFilters.people = "anyone";
    searchFilters.shared = "all";
    searchFilters.fromDate = "";
    searchFilters.toDate = "";
  }
  // LOAD USERS | FOLLOW USERS
  async function followUser(userId: string | number) {
    await api.post(`/follow/${userId}`);
    await loadSuggestedUsers("users");
  }

  // SEARCH USERS
  const queryUsers = ref("");
  const searchUsersResults = ref<SearchUser[]>([]);
  async function searchUsers() {
    try {
      const response = await api.get(`/users/search?query=${queryUsers.value}`);
      searchUsersResults.value = response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }
  function verifyNewChatSearch(userId: string | number) {
    const existingChat = userChats.value.find(
      (chat) => chat.receiver.id === userId,
    );
    if (existingChat) {
      selectChat(existingChat.chatId);
      queryUsers.value = "";
      searchUsersResults.value = [];
    } else {
      createChat(userId);
    }
  }
  function clearQuery() {
    queryUsers.value = "";
    searchUsersResults.value = [];
  }

  //================================================

  // LOAD USER CHATS
  const userChats = ref<UserChat[]>([]);
  async function loadUserChats() {
    try {
      const response = await api.get("/chats");
      userChats.value = response.data || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }
  const filteredSuggestedUsers = computed(() =>
    suggestedUsers.value.filter(
      (user) => !userChats.value.some((chat) => chat.receiver.id === user.id),
    ),
  );

  // LOAD SELECTED USER CHAT
  const selectedChat = ref<string | number>("");
  const chatUserInfo = ref<ChatUser>({
    id: "",
    name: "",
    username: "",
    avatarUrl: "",
    createdAt: "",
  });
  const chatMessages = ref<ChatMessage[]>([]);
  const userChatId = ref<string | number>("");
  const displayUserInfo = ref<boolean>(false);
  async function selectChat(chatId: string | number) {
    try {
      selectedChat.value = chatId;
      if (!chatId) {
        console.error("No chat ID provided");
        return;
      }
      const response = await api.get(`/chats/${chatId}/messages`);
      chatMessages.value = response.data.message || [];
      chatUserInfo.value = response.data.receiver;
      userChatId.value = chatId;
      displayUserInfo.value = false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }
  function getUserInfo() {
    displayUserInfo.value = !displayUserInfo.value;
  }
  const groupMessagesByDate = computed(() => {
    const groups: Record<string, ChatMessage[]> = {};

    for (const message of chatMessages.value) {
      const date = new Date(message.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(message);
    }

    return groups;
  });

  // SEND NEW MESSAGE IN SELECTED USER CHAT
  const message = ref<string>("");
  async function sendMessage(chatId: string | number) {
    try {
      // PREVENT SENDING EMPTY MESSAGES
      if (!message.value.trim()) return;

      await api.post(`/chats/${chatId}/new`, {
        content: message.value.trim(),
      });
      message.value = "";

      // RELOAD MESSAGES AFTER SENDING
      await selectChat(chatId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // CREATE A NEW USER CHAT
  async function createChat(userId: string | number) {
    try {
      const response = await api.post("/chats/new", { userId: userId });
      const newChatId = response.data.chatId;
      console.log("New chat created with ID: ", newChatId);
      await selectChat(newChatId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // DELETE A USER CHAT
  async function deleteChat(chatId: string | number) {
    try {
      await api.delete(`/chats/${chatId}`);
      selectedChat.value = "";
      chatMessages.value = [];
      userChatId.value = "";
      await loadUserChats();
      await loadSuggestedUsers("following");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  //================================================

  // HELPER FUNCTIONS
  const selectedUserId = ref<string | number>("");
  function selectedUser(userId: string | number) {
    selectedUserId.value = userId;
    editingComment.openCommentPostId = null;
  }
  function toUtcStartOfDay(date: string): string {
    return date ? `${date}T00:00:00.000Z` : "";
  }
  function toUtcEndOfDay(date: string): string {
    return date ? `${date}T23:59:59.999Z` : "";
  }
  const dateJoinedUser = computed(
    // FORMAT THE MONTH NUMBER TO TEXT AND SHOW ONLY THE MONTH AND YEAR
    () => {
      const date = new Date(chatUserInfo.value.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    },
  );

  return {
    // VARIABLES
    favoriteUsers,
    suggestedUsers,
    favSearchQuery,
    favStateEdit,
    selectedUserId,
    followsFilter,
    followingUsers,
    followersUsers,
    userProfile,
    originalProfile,
    editingProfile,
    hasUnsavedChanges,
    searchFilters,
    queryUsers,
    searchUsersResults,
    userChats,
    selectedChat,
    chatUserInfo,
    chatMessages,
    userChatId,
    displayUserInfo,
    message,

    // FUNCTIONS
    loadFavoriteUsers,
    searchFavoriteUsers,
    addFavoriteUser,
    deleteFavoriteUser,
    removeAllFavoriteUsers,
    loadSuggestedUsers,
    selectedUser,
    loadFollowingUsers,
    loadFollowersUsers,
    loadUserProfile,
    loadMyProfile,
    toggleEdit,
    toggleCloseEdit,
    saveProfile,
    deleteAccount,
    searchPost,
    resetFilters,
    followUser,
    searchUsers,
    loadUserChats,
    filteredSuggestedUsers,
    selectChat,
    getUserInfo,
    groupMessagesByDate,
    dateJoinedUser,
    verifyNewChatSearch,
    clearQuery,
    sendMessage,
    createChat,
    deleteChat,
  };
}
