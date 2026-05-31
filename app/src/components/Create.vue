<script setup lang="ts">
// VUE
import { onMounted, onBeforeUnmount, ref, watch } from "vue";

// SERVICES
import api from "../services/api";

// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SpriteIcon from "./SpriteIcon.vue";
import SkeletonUserRow from "./states/SkeletonUserRow.vue";
import SkeletonPost from "./states/SkeletonPost.vue";
import ErrorState from "./states/ErrorState.vue";
import EmptyState from "./states/EmptyState.vue";

// STYLES
import "../styles/input.css";
import "../styles/app-layout.css";
import "../styles/CreatePost.css";

// TYPES
import type { SearchUser } from "../types/search";

// POSTS | USERDATA
import { usePosts } from "../shared/usePosts";

// POSTS
const {
  // VARIABLES
  createPostData,
  userdata,
  loadingPosts,
  postsError,

  // FUNCTIONS
  loadPosts,
  addLocation,
  createPost,
  changeVisibility,
  toggleHideLikes,
  toggleDisableComments,
  selectMention,
  addSpecificFollowers,
} = usePosts();

// USER | FOLLOWING USERS
import { useUserData } from "../shared/userData";

const { followingUsers, loadingFollowingUsers, followingUsersError, loadFollowingUsers } = useUserData();

const query = ref("");
const results = ref<SearchUser[]>([]);
const loadingSearchUsers = ref(false);
const searchUsersError = ref("");

let searchUsersTimer: ReturnType<typeof window.setTimeout> | null = null;

async function searchUsers() {
  loadingSearchUsers.value = true;
  searchUsersError.value = "";

  try {
    if (query.value.trim() === "") {
      results.value = [];
      return;
    }

    const response = await api.get(`/users/search?query=${query.value}`);
    results.value = response.data;
  } catch (error) {
    searchUsersError.value = "Failed to search users.";
    console.error("Error searching users: ", error);
  } finally {
    loadingSearchUsers.value = false;
  }
}

watch(query, () => {
  if (searchUsersTimer) {
    window.clearTimeout(searchUsersTimer);
  }

  searchUsersTimer = window.setTimeout(() => {
    searchUsers();
  }, 300);
});

onBeforeUnmount(() => {
  if (searchUsersTimer) {
    window.clearTimeout(searchUsersTimer);
  }
});

function addMention(username: string) {
  selectMention(username);
  query.value = "";
}

onMounted(() => {
  loadPosts("my-posts");
});
</script>

<template>
  <div class="app-layout">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="createPost">
        <h2>Create Post</h2>
        <div class="post-text body-box shadow-light">
          <textarea
            name="text"
            id="text"
            v-model="createPostData.content"
          ></textarea>
          <p>
            Mentions:
            <span
              v-for="mention in createPostData.mentions"
              :key="mention.username"
            >
              @{{ mention.username }}</span
            >
          </p>
          <p>Location: {{ createPostData.location }}</p>
          <div class="post-adds">
            <p>Add to your post</p>
            <div>
              <button class="button" type="button" @click="addLocation()">
                <SpriteIcon
                  name="location"
                  size="24"
                  color="#535353"
                  title="Add location"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mediaPost">
        <button
          class="body-box shadow-light button"
          type="button"
          @click="createPost()"
        >
          Post
        </button>
      </div>
      <div class="addMentions">
        <h2>Add Mentions</h2>
        <div class="input-search shadow-light">
          <div>
            <SpriteIcon
              name="search"
              size="24"
              color="#535353"
              title="Search User"
            />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for a user"
            v-model="query"
          />
        </div>
        <SkeletonUserRow v-if="loadingSearchUsers" :count="3" />
        <ErrorState
          v-else-if="searchUsersError"
          :message="searchUsersError"
          @retry="searchUsers"
        />
        <div class="input-results" v-else-if="results.length > 0">
          <div class="user-result" v-for="user in results" :key="user.id">
            <button class="button" @click="addMention(user.username)">
              {{ user.username }}
            </button>
          </div>
        </div>
        <EmptyState
          v-else-if="query.trim().length > 0"
          title="No users found"
          message="Try a different username."
          icon="search"
        />
      </div>
      <div class="optionsPost">
        <h2>Options</h2>
        <div class="modesOptions">
          <button class="button" type="button" @click="toggleHideLikes()">
            <div
              class="btnIcon"
              :class="{ selected: createPostData.hideLikes }"
            >
              <SpriteIcon
                name="heart"
                size="18"
                color="#535353"
                title="Hide Likes"
              />
            </div>
            <div class="infoIcon">
              <p>Hide like count</p>
            </div>
          </button>
          <button class="button" type="button" @click="toggleDisableComments()">
            <div
              class="btnIcon"
              :class="{ selected: createPostData.disableComments }"
            >
              <SpriteIcon
                name="comment"
                size="18"
                color="#535353"
                title="Hide Comments"
              />
            </div>
            <div class="infoIcon">
              <p>Turn off commenting</p>
            </div>
          </button>
        </div>
        <div class="visibilityPost">
          <p>Visibility</p>
          <div class="modesOptions">
            <button
              class="button"
              type="button"
              @click="changeVisibility('PUBLIC')"
            >
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'PUBLIC' }"
              >
                <SpriteIcon
                  name="public"
                  size="18"
                  color="#535353"
                  title="Public"
                />
              </div>
              <div class="infoIcon">
                <p>Public</p>
                <p>Anyone on/off Netlink</p>
              </div>
            </button>
            <button
              class="button"
              type="button"
              @click="changeVisibility('FOLLOWERS')"
            >
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'FOLLOWERS' }"
              >
                <SpriteIcon
                  name="followers"
                  size="20"
                  color="#535353"
                  title="Followers"
                />
              </div>
              <div class="infoIcon">
                <p>Followers</p>
                <p>Your followers only</p>
              </div>
            </button>
            <button
              class="button"
              type="button"
              @click="changeVisibility('ONLY_ME')"
            >
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'ONLY_ME' }"
              >
                <SpriteIcon
                  name="lock"
                  size="20"
                  color="#535353"
                  title="Only me"
                />
              </div>
              <div class="infoIcon">
                <p>Only Me</p>
                <p>Only you can see this</p>
              </div>
            </button>
            <button
              class="button"
              type="button"
              @click="(changeVisibility('SPECIFIC'), loadFollowingUsers())"
            >
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'SPECIFIC' }"
              >
                <SpriteIcon
                  name="followers"
                  size="20"
                  color="#535353"
                  title="Specific followers"
                />
              </div>
              <div class="infoIcon">
                <p>Specific Followers</p>
                <p>Selected followers</p>
              </div>
            </button>
          </div>
        </div>
        <div class="sp-following-box" v-if="createPostData.visibility === 'SPECIFIC'">
          <p>Specific Followers</p>
          <SkeletonUserRow v-if="loadingFollowingUsers" :count="3" />
          <ErrorState
            v-else-if="followingUsersError"
            :message="followingUsersError"
            @retry="loadFollowingUsers"
          />
          <div class="following-list" v-else-if="followingUsers.length > 0">
            <div
              class="followingUsers-result"
              v-for="user in followingUsers"
              :key="user.id"
            >
              <input
                type="checkbox"
                name="following-user"
                :id="`following-user-${user.username}`"
                :value="user.id"
                @change="addSpecificFollowers(user.id)"
              />
              <span>{{ user.username }}</span>
            </div>
          </div>
          <EmptyState
            v-else
            title="No followers to choose from"
            message="Follow more users before selecting a specific audience."
            icon="connections"
          />
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-myPosts">
        <h2>My Posts</h2>
        <SkeletonPost v-if="loadingPosts" />
        <ErrorState
          v-else-if="postsError"
          :message="postsError"
          @retry="() => loadPosts('my-posts')"
        />
        <Post v-else-if="userdata.length > 0" />
        <EmptyState
          v-else
          title="No posts yet"
          message="Create a post to preview it here."
          icon="create"
        />
      </div>
    </div>
  </div>
</template>
