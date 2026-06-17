<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Profile from "./Profile.vue";
import Post from "./Posts.vue";
import AvatarIcon from "../assets/icons/avatar-icon.vue";
import SkeletonUserRow from "./states/SkeletonUserRow.vue";
import SkeletonPost from "./states/SkeletonPost.vue";
import LoadingState from "./states/LoadingState.vue";
import ErrorState from "./states/ErrorState.vue";
import EmptyState from "./states/EmptyState.vue";

// STYLES
import "../styles/profile.css";
import "../styles/utilities.css";
import "../styles/app-layout.css";
import "../styles/connections.css";
import "../styles/userbutton.css";
import "../styles/buttons.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

// POSTS COMPOSITION
import { usePosts } from "../shared/usePosts";

// USER DATA FUNCTIONS
const {
  // VARIABLES
  selectedUserId,
  followsFilter,
  followingUsers,
  followersUsers,
  loadingFollowingUsers,
  followingUsersError,
  loadingFollowersUsers,
  followersUsersError,
  loadingUserProfile,
  userProfileError,

  // FUNCTIONS
  selectedUser,
  loadFollowingUsers,
  loadFollowersUsers,
  loadUserProfile,
  followUser,
  unfollowUser,
} = useUserData();

// POST FUNCTIONS
const { userdata, loadingPosts, postsError, loadPosts } = usePosts();

async function refreshSelectedConnection() {
  if (!selectedUserId.value) {
    return;
  }

  await loadUserProfile(selectedUserId.value);
  await loadPosts(`user/${selectedUserId.value}`);
}
onMounted(async () => {
  selectedUserId.value = "";
  await loadFollowingUsers();
});

watch(selectedUserId, async (newUserId) => {
  if (newUserId) {
    await loadUserProfile(newUserId);
    await loadPosts(`user/${newUserId}`);
  }
});
</script>

<template>
  <div class="app-layout">
    <Navigation />
    <div class="dash-sidepanel scrollable-hidden">
      <div class="dash-follows-box">
        <button
          class="button"
          type="button"
          @click="((followsFilter = 'following'), loadFollowingUsers())"
          :class="{ 'selected-follow': followsFilter === 'following' }"
        >
          Following
        </button>
        <button
          class="button"
          type="button"
          @click="((followsFilter = 'followers'), loadFollowersUsers())"
          :class="{ 'selected-follow': followsFilter === 'followers' }"
        >
          Followers
        </button>
      </div>
      <div v-if="followingUsers.length > 0 || followersUsers.length > 0">
        <div class="following-panel" v-if="followsFilter === 'following'">
          <SkeletonUserRow v-if="loadingFollowingUsers" :count="4" />
          <ErrorState
            v-else-if="followingUsersError"
            :message="followingUsersError"
            @retry="loadFollowingUsers"
          />
          <div
            v-else-if="followingUsers.length > 0"
            class="main-follow-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in followingUsers"
            :key="user.id"
          >
            <div class="user-box-connection">
              <div class="box-user-info">
                <button type="button" @click="selectedUser(user.id)">
                  <div class="bar-user-avatardata">
                    <AvatarIcon />
                    <div class="bar-userdata">
                      <h2 class="bar-user-name">{{ user.name }}</h2>
                      <p class="bar-user-username">@{{ user.username }}</p>
                    </div>
                  </div>
                </button>
                <div>
                  <button class="unfollow-btn" @click="unfollowUser(user.id)">
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          </div>
          <EmptyState
            v-else
            title="No following users"
            message="Follow someone to see them here."
            icon="connections"
          />
        </div>
        <div class="followers-panel" v-else>
          <SkeletonUserRow v-if="loadingFollowersUsers" :count="4" />
          <ErrorState
            v-else-if="followersUsersError"
            :message="followersUsersError"
            @retry="loadFollowersUsers"
          />
          <div
            v-else-if="followersUsers.length > 0"
            class="main-follow-box"
            :class="{ selected: selectedUserId === user.id }"
            v-for="user in followersUsers"
            :key="user.id"
          >
            <div class="user-box-connection">
              <div class="box-user-info">
                <button type="button" @click="selectedUser(user.id)">
                  <div class="bar-user-avatardata">
                    <AvatarIcon />
                    <div class="bar-userdata">
                      <h2 class="bar-user-name">{{ user.name }}</h2>
                      <p class="bar-user-username">@{{ user.username }}</p>
                    </div>
                  </div>
                </button>
                <div>
                  <button
                    class="unfollow-btn"
                    v-if="user.isFollowedByMe === false"
                    @click="followUser(user.id)"
                  >
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
          <EmptyState
            v-else
            title="No followers yet"
            message="Your audience will appear here once people follow you."
            icon="connections"
          />
        </div>
      </div>
      <EmptyState
        v-else
        title="No connections yet"
        message="Follow people or wait for them to follow you."
        icon="connections"
      />
    </div>
    <div class="dash-content scrollable-hidden">
      <div v-if="followingUsers.length > 0 || followersUsers.length > 0">
        <div class="dash-profile">
          <h2>Profile</h2>
          <LoadingState
            v-if="loadingUserProfile"
            title="Loading profile"
            message="Fetching the selected account."
          />
          <ErrorState
            v-else-if="userProfileError"
            :message="userProfileError"
            @retry="refreshSelectedConnection"
          />
          <Profile v-else />
        </div>
        <div
          class="dash-posts"
          v-if="followingUsers.length > 0 || followersUsers.length > 0"
        >
          <h2>Posts</h2>
          <SkeletonPost v-if="loadingPosts" />
          <ErrorState
            v-else-if="postsError"
            :message="postsError"
            @retry="refreshSelectedConnection"
          />
          <Post v-else-if="userdata.length > 0" />
          <EmptyState
            v-else
            title="No posts yet"
            message="This account has not shared anything yet."
            icon="create"
          />
        </div>
      </div>
      <EmptyState
        v-else
        title="No connections yet"
        message="Follow a user to start filling this space."
        icon="connections"
      />
    </div>
  </div>
</template>
