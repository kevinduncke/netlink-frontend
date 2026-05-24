<script setup lang="ts">
// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SearchModal from "./SearchModal.vue";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/app-layout.css";
import "../styles/CreatePost.css";

// POSTS | USERDATA
import { usePosts } from "../shared/usePosts";
import { onMounted } from "vue";

// POSTS
const {
  // VARIABLES
  createPostData,
  userdata,

  // FUNCTIONS
  loadPosts,
  addMention,
  addLocation,
  createPost,
  changeVisibility,
  toggleHideLikes,
  toggleDisableComments,
  selectMention,
  addSpecificFollowers,
} = usePosts();

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
              > @{{ mention.username }}</span
            >
          </p>
          <p>Location: {{ createPostData.location }}</p>
          <div class="post-adds">
            <p>Add to your post</p>
            <div>
              <button class="button" type="button" @click="addMention()">
                <SpriteIcon
                  name="at"
                  size="24"
                  color="#535353"
                  title="Add mention"
                />
              </button>
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
      <div class="optionsPost">
        <h2>Options</h2>
        <div class="visibilityPost">
          <p>Who can view your post?</p>
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
              @click="changeVisibility('SPECIFIC')"
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
        <div class="settingsPost">
          <p>Post Settings</p>
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
            <button
              class="button"
              type="button"
              @click="toggleDisableComments()"
            >
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
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-myPosts" v-if="userdata.length > 0">
        <h2>My Posts</h2>
        <Post />
      </div>
      <div class="dash-empty-posts" v-else>
        <SpriteIcon
          name="create"
          size="64"
          color="#535353"
          title="Create Post"
        />
        <h2>Create a post</h2>
      </div>
    </div>
  </div>
  <SearchModal
    :show="createPostData.showMentionModal"
    mode="mention"
    @close="createPostData.showMentionModal = false"
    @select="selectMention($event)"
  />
  <SearchModal
    :show="createPostData.showSpecificModal"
    mode="specific"
    @close="createPostData.showSpecificModal = false"
    @select-multiple="addSpecificFollowers($event)"
  />
</template>
