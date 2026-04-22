// VUE
import { ref } from "vue";

// SERVICES, STORES AND ROUTES
import axios from "axios";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { router } from "../router";

// TYPES
import type { FollowUser } from "../types/users";
import type { SearchFavoriteUser } from "../types/search";
import type { UserProfile } from "../types/users";

// POSTS COMPOSITION + VARIABLES
import { usePosts } from "../shared/usePosts";

export function useUserData() {
  const authStore = useAuthStore();
  const { editingComment } = usePosts();

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
      await loadSuggestedUsers();
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

  // HELPER FUNCTIONS
  const selectedUserId = ref<string | number>("");
  function selectedUser(userId: string | number) {
    selectedUserId.value = userId;
    editingComment.openCommentPostId = null;
  }

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
  };
}
