// VUE
import { ref, reactive, computed } from "vue";

// SERVICES, STORES AND ROUTES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { router } from "../router";
import { idEquals, isPresentId } from "./idUtils";

// TYPES
import type { Followers, FollowUser, UserChat } from "../types/users";
import type { SearchFavoriteUser, SearchUser } from "../types/search";
import type { UserProfile } from "../types/users";
import type { Report } from "../types/types";

// POSTS COMPOSITION + VARIABLES
import { usePosts } from "../shared/usePosts";
import type { ChatMessage, ChatUser } from "../types/chat";
import type { NotificationGroup } from "../types/types";
import {
  consoleMutationFeedback,
  runFollowMutation,
  runSendMessage,
  runCreateChat,
  runDeleteChat,
} from "./actions";

export const selectedUserId = ref<string | number>("");

// SINGLETON INSTANCE TO SHARE STATTE ACROSS ALL COMPONENTS
let userDataInstance: ReturnType<typeof createUserData> | null = null;

function createUserData() {
  const authStore = useAuthStore();
  const { editingComment } = usePosts();
  const {
    // VARIABLES
    userdata,

    // FUNCTIONS
    loadPosts,
  } = usePosts();

  // LOAD FAVORITE USERS
  const favoriteUsers = ref<FollowUser[]>([]);
  const loadingFavoriteUsers = ref(false);
  const favoriteUsersError = ref("");
  async function loadFavoriteUsers() {
    loadingFavoriteUsers.value = true;
    favoriteUsersError.value = "";

    try {
      const response = await api.get("/favorites");
      favoriteUsers.value = response.data.users;
    } catch (error) {
      favoriteUsersError.value = "Failed to load favorite users.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingFavoriteUsers.value = false;
    }
  }

  // SEARCH FAVORITE USERS
  const favSearchQuery = ref<string>("");
  const loadingSearchFavoriteUsers = ref(false);
  const searchFavoriteUsersError = ref("");
  async function searchFavoriteUsers(query: string) {
    loadingSearchFavoriteUsers.value = true;
    searchFavoriteUsersError.value = "";

    try {
      const response = await api.get("/favorites/search", {
        params: { q: query },
      });

      const users: SearchFavoriteUser[] = response.data.users || [];
      favoriteUsers.value = users.filter((u) => u.isFavorite);
      suggestedUsers.value = users.filter((u) => !u.isFavorite);
    } catch (error) {
      searchFavoriteUsersError.value = "Failed to search favorite users.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingSearchFavoriteUsers.value = false;
    }
  }

  // EDIT FAVORITE USERS
  const favStateEdit = ref<boolean>(false);

  // ADD FAVORITE USERS
  async function addFavoriteUser(userId: string | number) {
    try {
      const response = await api.post(`/favorites/${userId}`);
      favoriteUsers.value.push(response.data);
      suggestedUsers.value = suggestedUsers.value.filter(
        (user) => !idEquals(user.id, userId),
      );
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
      // ADD REMOVED USER TO SUGGESTED USERS LOCALLY
      const removedUser = favoriteUsers.value.find((user) =>
        idEquals(user.id, userId),
      );
      if (removedUser) {
        suggestedUsers.value.push(removedUser);
      }
      // REMOVE OLD FAVORITE USER FROM FAVORITE USERS LOCALLY
      favoriteUsers.value = favoriteUsers.value.filter(
        (user) => !idEquals(user.id, userId),
      );
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

      throw error;
    }
  }

  // NOTIFICATIONS
  const notifications = ref<NotificationGroup>({
    today: [],
    yesterday: [],
    older: [],
    unReadNotifications: 0,
  });
  const loadingNotifications = ref(false);
  const notificationsError = ref("");
  async function loadNotifications() {
    loadingNotifications.value = true;
    notificationsError.value = "";

    try {
      const response = await api.get("/users/notifications");
      notifications.value = response.data || {
        today: [],
        yesterday: [],
        older: [],
        unReadNotifications: 0,
      };
    } catch (error) {
      notificationsError.value = "Failed to load notifications.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        notifications.value = {
          today: [],
          yesterday: [],
          older: [],
          unReadNotifications: 0,
        };
        return;
      }

      throw error;
    } finally {
      loadingNotifications.value = false;
    }
  }

  async function markAllNotificationsAsRead() {
    await api.patch("/users/notifications/all-read");
    await loadNotifications();
  }

  // SUGGESTED USERS
  const suggestedUsers = ref<FollowUser[]>([]);
  const loadingSuggestedUsers = ref(false);
  const suggestedUsersError = ref("");
  async function loadSuggestedUsers(route: string) {
    loadingSuggestedUsers.value = true;
    suggestedUsersError.value = "";

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
      suggestedUsersError.value = "Failed to load suggested users.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingSuggestedUsers.value = false;
    }
  }

  // FILTER FOLLOW PANEL
  const followsFilter = ref<string>("following");

  // LOAD FOLLOWING USERS
  const followingUsers = ref<FollowUser[]>([]);
  const loadingFollowingUsers = ref(false);
  const followingUsersError = ref("");

  async function loadFollowingUsers() {
    loadingFollowingUsers.value = true;
    followingUsersError.value = "";

    try {
      const response = await api.get("/follow/following");
      followingUsers.value = response.data;
      const firstFollowingUser = followingUsers.value[0];
      if (firstFollowingUser) {
        selectedUserId.value = "";
        selectedUserId.value = firstFollowingUser.id;
      }
    } catch (error) {
      followingUsersError.value = "Failed to load following users.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingFollowingUsers.value = false;
    }
  }

  // LOAD FOLLOWERS USERS
  const followersUsers = ref<Followers[]>([]);
  const loadingFollowersUsers = ref(false);
  const followersUsersError = ref("");

  async function loadFollowersUsers() {
    loadingFollowersUsers.value = true;
    followersUsersError.value = "";

    try {
      followsFilter.value = "followers";
      const response = await api.get("/follow/followers");
      followersUsers.value = response.data;

      const firstFollowerUser = followersUsers.value[0];
      if (firstFollowerUser) {
        selectedUserId.value = "";
        selectedUserId.value = firstFollowerUser.id;
      }
    } catch (error) {
      followersUsersError.value = "Failed to load followers users.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingFollowersUsers.value = false;
    }
  }

  // LOAD USER PROFILE
  const userProfile = ref<UserProfile>({
    id: "",
    name: "",
    username: "",
    bio: "",
    url: "",
    avatarUrl: "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createdAt: "",
    isFollowedByMe: false,
    privacyMode: false,
    accountVisibility: "public",
    isBlockedByMe: false,
    isRestrictedByMe: false,
    hasRestrictedMe: false,
  });
  function resetUserProfile() {
    userProfile.value = {
      id: "",
      name: "",
      username: "",
      bio: "",
      url: "",
      avatarUrl: "",
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      createdAt: "",
      isFollowedByMe: false,
      privacyMode: false,
      accountVisibility: "public",
      isBlockedByMe: false,
      isRestrictedByMe: false,
      hasRestrictedMe: false,
    };
    originalProfile.value = {
      id: "",
      name: "",
      username: "",
      bio: "",
      url: "",
      avatarUrl: "",
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      createdAt: "",
      isFollowedByMe: false,
      privacyMode: false,
      accountVisibility: "public",
      isBlockedByMe: false,
      isRestrictedByMe: false,
      hasRestrictedMe: false,
    };
  }
  const loadingUserProfile = ref(false);
  const userProfileError = ref("");

  async function loadUserProfile(userId: string | number) {
    loadingUserProfile.value = true;
    userProfileError.value = "";

    try {
      const res = await api.get(`/users/${userId}`);
      userProfile.value = res.data;

      userProfile.value.accountVisibility = accountVisibility(
        userProfile.value.privacyMode,
        userProfile.value.isFollowedByMe,
      );
    } catch (error) {
      userProfileError.value = "Failed to load user profile.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingUserProfile.value = false;
    }
  }

  // LOAD LOGGED USER PROFILE
  const originalProfile = ref({} as UserProfile);
  const loadingMyProfile = ref(false);
  const myProfileError = ref("");

  async function loadMyProfile() {
    loadingMyProfile.value = true;
    myProfileError.value = "";

    try {
      const response = await api.get("/users/me");
      originalProfile.value = structuredClone(response.data);
      userProfile.value = response.data;
    } catch (error) {
      myProfileError.value = "Failed to load your profile.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingMyProfile.value = false;
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

  // CHANGE LOGGED USER ACCOUNT PRIVACY
  async function changePrivacyAccount(state: boolean) {
    try {
      await api.patch("/users/me/privacy", { privacyMode: !state });
      userProfile.value.privacyMode = !state;
      originalProfile.value.privacyMode = !state;
    } catch (error) {
      console.error("Error changing privacy settings: ", error);
    }
  }

  // CHECK ACCOUNT PRIVACY VISIBILITY
  function accountVisibility(
    privacyMode: boolean,
    isFollowedByMe: boolean,
  ): "public" | "private" {
    if (privacyMode === true && isFollowedByMe === false) {
      return "private";
    } else {
      return "public";
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

  // UPDATE WATCHED PROFILE ACCOUNT FIELDS
  function updateUnsavedProfileChanges() {
    hasUnsavedChanges.value =
      (userProfile.value.name ?? "") !== (originalProfile.value.name ?? "") ||
      (userProfile.value.username ?? "") !==
        (originalProfile.value.username ?? "") ||
      (userProfile.value.bio ?? "") !== (originalProfile.value.bio ?? "") ||
      (userProfile.value.url ?? "") !== (originalProfile.value.url ?? "") ||
      (userProfile.value.avatarUrl ?? "") !==
        (originalProfile.value.avatarUrl ?? "");
  }

  // SEARCH POSTS
  const searchFilters = reactive({
    query: "",
    people: "anyone",
    shared: "all",
    fromDate: "",
    toDate: "",
  });
  let latestSearchRequestId = 0;
  const loadingSearchPosts = ref(false);
  const searchPostsError = ref("");

  async function searchPost(filters = searchFilters) {
    loadingSearchPosts.value = true;
    searchPostsError.value = "";

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
      const { posts } = response.data;
      userdata.value = posts || [];
    } catch (error) {
      searchPostsError.value = "Failed to search posts.";
      console.error("Error searching posts: ", error);
    } finally {
      loadingSearchPosts.value = false;
    }
  }
  function resetFilters() {
    searchFilters.query = "";
    searchFilters.people = "anyone";
    searchFilters.shared = "all";
    searchFilters.fromDate = "";
    searchFilters.toDate = "";
  }

  // FOLLOW || UNFOLLOW USER
  async function followUser(userId: string | number) {
    try {
      await runFollowMutation({
        state: {
          suggestedUsers,
          followersUsers,
          followingUsers,
          userProfile,
          notifications,
          selectedUserId,
        },
        userId,
        nextIsFollowed: true,
        onRequest: async (currentUserId) => {
          await api.post(`/follow/${currentUserId}`);
        },
        onFeedback: consoleMutationFeedback,
      });
    } catch (error) {
      throw error;
    }
  }
  async function unfollowUser(userId: string | number) {
    try {
      await runFollowMutation({
        state: {
          suggestedUsers,
          followersUsers,
          followingUsers,
          userProfile,
          notifications,
          selectedUserId,
        },
        userId,
        nextIsFollowed: false,
        onRequest: async (currentUserId) => {
          await api.delete(`/follow/${currentUserId}`);
        },
        onFeedback: consoleMutationFeedback,
      });
      selectedUserId.value = 0;
    } catch (error) {
      throw error;
    }
  }

  // MODAL ACTIONS AND STATES
  const modalCurrentStatus = ref<
    "none" | "block" | "unblock" | "restrict" | "unrestrict" | "report"
  >("none");
  const modalTargetUserId = ref<string | number>("");
  const modalReportTypes = ref<
    "User" | "Post" | "Comment" | "Message" | "None"
  >("None");
  const closeModal = () => {
    modalCurrentStatus.value = "none";
    modalTargetUserId.value = "";
    modalReportTypes.value = "None";
    reportData.userId = null;
    reportData.reason = null;
    reportData.details = "";
    reportData.referenceId = null;
  };

  // BLOCK || UNBLOCK USER
  async function blockUser(userId: string | number) {
    try {
      const response = await api.post(`/privacy/block/${userId}`);
      if (response.status === 200) {
        closeModal();
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  }
  async function unblockUser(userId: string | number) {
    try {
      const response = await api.delete(`/privacy/block/${userId}`);
      if (response.status === 200) {
        userProfile.value.isBlockedByMe = false;
        closeModal();
      }
    } catch (error) {
      throw error;
    }
  }

  // RESTRICT || UNRESTRICT USER
  async function restrictUser(userId: string | number) {
    try {
      const response = await api.post(`/privacy/mute/${userId}`);
      if (response.status === 200) {
        userProfile.value.isRestrictedByMe = true;
        closeModal();
      }
    } catch (error) {
      throw error;
    }
  }
  async function unrestrictUser(userId: string | number) {
    try {
      const response = await api.delete(`/privacy/mute/${userId}`);
      if (response.status === 200) {
        userProfile.value.isRestrictedByMe = false;
        closeModal();
      }
    } catch (error) {
      throw error;
    }
  }

  // REPORT USER
  const reportData = reactive<Report>({
    userId: null,
    details: "",
    reason: null,
    type: null,
    referenceId: null,
  });
  async function reportUser(userId: string | number) {
    try {
      const response = await api.post(`/privacy/report/${userId}`, {
        targetUserId: userId,
        type: reportData.type,
        reason: reportData.reason,
        referenceId: reportData.referenceId,
        details: reportData.details,
      });
      if (response.status === 200) {
        closeModal();
      }
    } catch (error) {
      throw error;
    }
  }
  function handleReport() {
    if (modalTargetUserId.value === null) return;
    reportUser(modalTargetUserId.value);
  }

  // SEARCH USERS
  const queryUsers = ref("");
  const searchUsersResults = ref<SearchUser[]>([]);
  let latestSearchUsersRequestId = 0;
  const loadingSearchUsers = ref(false);
  const searchUsersError = ref("");

  async function searchUsers() {
    loadingSearchUsers.value = true;
    searchUsersError.value = "";

    try {
      const requestId = ++latestSearchUsersRequestId;
      const response = await api.get(`/users/search?query=${queryUsers.value}`);

      if (requestId !== latestSearchUsersRequestId) {
        return;
      }

      searchUsersResults.value = response.data;
    } catch (error) {
      searchUsersError.value = "Failed to search users.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingSearchUsers.value = false;
    }
  }
  function verifyNewChatSearch(userId: string | number) {
    const existingChat = userChats.value.find((chat) =>
      idEquals(chat.receiver.id, userId),
    );
    if (existingChat) {
      selectChat(existingChat.id);
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

  // LOAD USER CHATS
  const userChats = ref<UserChat[]>([]);
  const loadingUserChats = ref(false);
  const userChatsError = ref("");

  async function loadUserChats() {
    loadingUserChats.value = true;
    userChatsError.value = "";

    try {
      const response = await api.get("/chats");
      userChats.value = response.data || [];

      selectedChat.value = "";
      chatMessages.value = [];
      userChatId.value = "";
    } catch (error) {
      userChatsError.value = "Failed to load your chats.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingUserChats.value = false;
    }
  }
  const filteredSuggestedUsers = computed(() =>
    suggestedUsers.value.filter(
      (user) =>
        !userChats.value.some((chat) => idEquals(chat.receiver.id, user.id)),
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
  const loadingChatMessages = ref(false);
  const chatMessagesError = ref("");
  const chatCursors = ref<Record<string, string | null>>({});
  const hasMoreMessages = ref<Record<string, boolean>>({});
  const unreadMessagesCount = ref(0);
  const userChatId = ref<string | number>("");
  const displayUserInfo = ref<boolean>(false);
  function resetChatState() {
    chatMessages.value = [];
    chatUserInfo.value = {
      id: "",
      name: "",
      username: "",
      avatarUrl: "",
      createdAt: "",
    };
    userChatId.value = "";
    displayUserInfo.value = false;
  }
  async function selectChat(chatId: string | number) {
    try {
      if (!isPresentId(chatId)) {
        console.error("No chat ID provided");
        return;
      }

      selectedChat.value = chatId;
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

  // LOAD MESSAGES + GROUP THEM BY DATE
  async function loadChatMessages(
    chatId: string | number,
    options = { older: false },
  ) {
    loadingChatMessages.value = true;
    chatMessagesError.value = "";

    // RST STATE
    if (!options.older) {
      chatMessages.value = [];
      chatCursors.value[chatId] = null;
      hasMoreMessages.value[chatId] = true;
      displayUserInfo.value = false;
    }

    // NO FETCH MORE MESSAGES
    if (hasMoreMessages.value[chatId] === false) {
      loadingChatMessages.value = false;
      return;
    }

    try {
      const params = new URLSearchParams({ limit: "20" });
      const cursor = chatCursors.value[chatId];
      if (cursor) {
        params.append("cursor", cursor);
      }

      const response = await api.get(`/chats/${chatId}/messages?${params}`);
      const { messages: newMessages, nextCursor, receiver } = response.data;

      if (options.older) {
        chatMessages.value.unshift(...(newMessages || []));
      } else {
        chatMessages.value = newMessages || [];
        chatUserInfo.value = receiver;
        userChatId.value = chatId;
        await getUnreadMessagesCount();
      }

      chatCursors.value[chatId] = nextCursor;
      hasMoreMessages.value[chatId] = nextCursor !== null;
    } catch (error) {
      chatMessagesError.value = "Failed to load chat messages.";

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    } finally {
      loadingChatMessages.value = false;
    }
  }
  const groupMessagesByDate = computed(() => {
    const groups: Record<string, ChatMessage[]> = {};

    if (selectedChat) {
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
    }
  });

  // GET UNREAD MESSAGES COUNT
  async function getUnreadMessagesCount() {
    try {
      const response = await api.get("/chats/messages/unread-count");
      unreadMessagesCount.value = response.data || 0;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authStore.logout();
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  // SEND NEW MESSAGE IN SELECTED USER CHAT
  const message = ref<string>("");
  async function sendMessage(chatId: string | number) {
    try {
      // PREVENT SENDING EMPTY MESSAGES
      if (!message.value.trim()) return;

      const currentUser = authStore.user as {
        id?: string | number;
        userId?: string | number;
      } | null;
      const senderId = currentUser?.id ?? currentUser?.userId ?? "";

      const optimisticMsg: ChatMessage = {
        id: `temp-${Date.now()}` as any,
        content: message.value.trim(),
        createdAt: new Date().toISOString(),
        chatId: chatId,
        senderId: senderId,
      } as ChatMessage;

      await runSendMessage({
        messages: chatMessages,
        message: optimisticMsg,
        onRequest: async (cId, content) => {
          const response = await api.post(`/chats/${cId}/new`, { content });
          return response.data as ChatMessage;
        },
        onFeedback: consoleMutationFeedback,
      });

      message.value = "";
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
      // CHECK BEFORE IF THE USER ID IS VALID
      // AND IF A CHAT WITH THIS USER ALREADY EXISTS
      if (
        !isPresentId(userId) ||
        userChats.value.find((chat) => idEquals(chat.receiver.id, userId))
      ) {
        const existingChatId = userChats.value.find((chat) =>
          idEquals(chat.receiver.id, userId),
        )?.id;
        if (existingChatId) {
          await selectChat(existingChatId);
          return;
        }
        console.error("No user ID provided or chat already exists");
        return;
      }

      // optimistic chat object
      const optimisticChat: UserChat = {
        id: `temp-${Date.now()}` as any,
        createdAt: new Date().toISOString(),
        receiver: {
          id: userId,
          name: "",
          username: "",
          avatarUrl: "",
        },
      } as UserChat;

      const serverChat = await runCreateChat({
        chats: userChats,
        chat: optimisticChat,
        onRequest: async (uId) => {
          const response = await api.post("/chats/new", { userId: uId });
          return response.data as UserChat;
        },
        onFeedback: consoleMutationFeedback,
      });

      const newChatId = serverChat?.id;
      if (newChatId) await selectChat(newChatId);
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
      await runDeleteChat({
        chats: userChats,
        chatId,
        onRequest: async (cId) => {
          await api.delete(`/chats/${cId}`);
        },
        onFeedback: consoleMutationFeedback,
      });

      selectedChat.value = "";
      resetChatState();
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

  // LOAD SELECTED USER PROFILE + POSTS
  async function loadSelectedUser(userId: string | number) {
    if (!isPresentId(userId)) {
      router.push("/dashboard");
      return;
    }

    resetUserProfile();
    await loadUserProfile(userId);
    await loadPosts(`user/${userId}`);
  }

  // HELPER FUNCTIONS
  function selectedUser(userId: string | number) {
    // CHECH IF THE SELECTED USER ID IS THE SAME AS THE CURRENTLY LOGGED USER ID
    const currentUser = authStore.user as {
      id?: number | string;
      userId?: number | string;
    } | null;
    if (idEquals(userId, currentUser?.id ?? currentUser?.userId)) {
      selectedUserId.value = "";
      return;
    }
    selectedUserId.value = userId;
    editingComment.openCommentPostId = null;
  }
  function toUtcStartOfDay(date: string): string {
    return date ? `${date}T00:00:00.000Z` : "";
  }
  function toUtcEndOfDay(date: string): string {
    return date ? `${date}T23:59:59.999Z` : "";
  }
  function dateConverter(value: string): string {
    // CHAT | MESSAGES = chatUserInfo.value.createdAt
    // USER = userProfile.value.createdAt
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      hour: "numeric",
    });
  }
  function getUserRoute(username: string, userId: string | number) {
    const currentUser = authStore.user as {
      id?: number | string;
    } | null;

    return idEquals(userId, currentUser?.id) ? "/account" : `/user/${username}`;
  }

  return {
    // VARIABLES
    favoriteUsers,
    loadingFavoriteUsers,
    favoriteUsersError,
    suggestedUsers,
    loadingSearchFavoriteUsers,
    searchFavoriteUsersError,
    loadingSuggestedUsers,
    suggestedUsersError,
    favSearchQuery,
    favStateEdit,
    notifications,
    loadingNotifications,
    notificationsError,
    selectedUserId,
    followsFilter,
    followingUsers,
    loadingFollowingUsers,
    followingUsersError,
    followersUsers,
    loadingFollowersUsers,
    followersUsersError,
    modalCurrentStatus,
    modalTargetUserId,
    modalReportTypes,
    reportData,
    userProfile,
    loadingUserProfile,
    userProfileError,
    originalProfile,
    loadingMyProfile,
    myProfileError,
    editingProfile,
    hasUnsavedChanges,
    searchFilters,
    loadingSearchPosts,
    searchPostsError,
    queryUsers,
    loadingSearchUsers,
    searchUsersError,
    searchUsersResults,
    userChats,
    loadingUserChats,
    userChatsError,
    selectedChat,
    chatUserInfo,
    chatMessages,
    loadingChatMessages,
    chatMessagesError,
    chatCursors,
    hasMoreMessages,
    unreadMessagesCount,
    userChatId,
    displayUserInfo,
    message,

    // FUNCTIONS
    loadFavoriteUsers,
    searchFavoriteUsers,
    addFavoriteUser,
    deleteFavoriteUser,
    removeAllFavoriteUsers,
    loadNotifications,
    markAllNotificationsAsRead,
    loadSuggestedUsers,
    selectedUser,
    loadSelectedUser,
    loadFollowingUsers,
    loadFollowersUsers,
    loadUserProfile,
    resetUserProfile,
    loadMyProfile,
    toggleEdit,
    toggleCloseEdit,
    saveProfile,
    changePrivacyAccount,
    deleteAccount,
    updateUnsavedProfileChanges,
    searchPost,
    resetFilters,
    followUser,
    unfollowUser,
    closeModal,
    blockUser,
    unblockUser,
    restrictUser,
    unrestrictUser,
    handleReport,
    reportUser,
    searchUsers,
    loadUserChats,
    filteredSuggestedUsers,
    selectChat,
    getUserInfo,
    loadChatMessages,
    groupMessagesByDate,
    dateConverter,
    getUserRoute,
    verifyNewChatSearch,
    clearQuery,
    getUnreadMessagesCount,
    sendMessage,
    createChat,
    deleteChat,
  };
}

export function useUserData() {
  if (!userDataInstance) {
    userDataInstance = createUserData();
  }
  return userDataInstance;
}
