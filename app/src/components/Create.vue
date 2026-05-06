<script setup lang="ts">
// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SearchModal from "./SearchModal.vue";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/body.css"

// POSTS | USERDATA
import { usePosts } from "../shared/usePosts";
import { onMounted } from "vue";

// POSTS
const {
  // VARIABLES
  createPostData,

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
})
</script>

<template>
  <div class="dash-wrapper">
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
        <button class="body-box shadow-light button" type="button" @click="createPost()">Post</button>
      </div>
      <div class="optionsPost">
        <h2>Options</h2>
        <div class="visibilityPost">
          <p>Who can view your post?</p>
          <div class="modesOptions">
            <button class="button" type="button" @click="changeVisibility('PUBLIC')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'PUBLIC' }"
              >
                <SpriteIcon name="public" size="18" color="#535353" title="Public" />
              </div>
              <div class="infoIcon">
                <p>Public</p>
                <p>Anyone on/off Netlink</p>
              </div>
            </button>
            <button class="button" type="button" @click="changeVisibility('FOLLOWERS')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'FOLLOWERS' }"
              >
                <SpriteIcon name="followers" size="20" color="#535353" title="Followers" />
              </div>
              <div class="infoIcon">
                <p>Followers</p>
                <p>Your followers only</p>
              </div>
            </button>
            <button class="button" type="button" @click="changeVisibility('ONLY_ME')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'ONLY_ME' }"
              >
                <SpriteIcon name="lock" size="20" color="#535353" title="Only me" />
              </div>
              <div class="infoIcon">
                <p>Only Me</p>
                <p>Only you can see this</p>
              </div>
            </button>
            <button class="button" type="button" @click="changeVisibility('SPECIFIC')">
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
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-myPosts">
        <h2>My Posts</h2>
        <Post />
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

<style scoped>
/* COMPONENT STYLES */
.post-text textarea {
  width: 100%;
  height: 100px;
  border: none;
  resize: none;
  outline: none;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  padding: 0.7rem;
  box-sizing: border-box;
}
.post-text > p {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
.post-adds {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.8rem;
  border: #f6f6f6 2px solid;
  border-radius: 5px;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
}
.mediaPost button {
  width: 100%;
  padding: var(--spacing-md) 0;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.8rem;
}
.visibilityPost p,
.settingsPost p {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
}
.settingsPost {
  margin-top: 1.5rem;
}
.modesOptions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.modesOptions button {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  outline: none;
}
.btnIcon {
  background-color: #ffffff;
  padding: 0.3rem;
  border-radius: 50px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8e8e8;
}
.modesOptions button:hover > .btnIcon {
  border: 1px solid var(--color-primary);
}
.modesOptions button:hover > .btnIcon svg {
  fill: var(--color-primary);
}
.btnIcon svg {
  fill: var(--color-gray-600);
}
.selected {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.selected svg {
  fill: var(--color-white) !important;
}
.infoIcon {
  padding: 0 1rem;
}
.infoIcon p {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.7rem;
  margin-bottom: 0.4rem;
  margin-top: 0;
}
.infoIcon p:last-child {
  font-family: "Montserrat Light", sans-serif;
  margin-bottom: 0;
}
</style>
