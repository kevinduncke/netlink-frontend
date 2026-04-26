<script setup lang="ts">
// COMPONENTS
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
import SearchModal from "./SearchModal.vue";
import SpriteIcon from "./SpriteIcon.vue";

// POSTS | USERDATA
import { usePosts } from "../shared/usePosts";

// POSTS
const {
  // VARIABLES
  createPostData,

  // FUNCTIONS
  addMention,
  addLocation,
  createPost,
  changeVisibility,
  toggleHideLikes,
  toggleDisableComments,
  selectMention,
  addSpecificFollowers,
} = usePosts();
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="createPost">
        <h2>Create Post</h2>
        <div class="post-text">
          <textarea
            name="text"
            id="text"
            v-model="createPostData.content"
          ></textarea>
          <p>Location: {{ createPostData.location }}</p>
          <div class="post-adds">
            <p>Add to your post</p>
            <div>
              <button type="button" @click="addMention()">
                <SpriteIcon
                  name="at"
                  size="24"
                  color="#006145"
                  title="Add mention"
                />
              </button>
              <button type="button" @click="addLocation()">
                <SpriteIcon
                  name="location"
                  size="24"
                  color="#006145"
                  title="Add location"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mediaPost">
        <button type="button" @click="createPost()">Post</button>
      </div>
      <div class="optionsPost">
        <h2>Options</h2>
        <div class="visibilityPost">
          <p>Who can view your post?</p>
          <div class="modesOptions">
            <button type="button" @click="changeVisibility('PUBLIC')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'PUBLIC' }"
              >
                <SpriteIcon name="public" size="18" title="Public" />
              </div>
              <div class="infoIcon">
                <p>Public</p>
                <p>Anyone on/off Netlink</p>
              </div>
            </button>
            <button type="button" @click="changeVisibility('FOLLOWERS')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'FOLLOWERS' }"
              >
                <SpriteIcon name="followers" size="20" title="Followers" />
              </div>
              <div class="infoIcon">
                <p>Followers</p>
                <p>Your followers only</p>
              </div>
            </button>
            <button type="button" @click="changeVisibility('ONLY_ME')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'ONLY_ME' }"
              >
                <SpriteIcon name="lock" size="20" title="Only me" />
              </div>
              <div class="infoIcon">
                <p>Only Me</p>
                <p>Only you can see this</p>
              </div>
            </button>
            <button type="button" @click="changeVisibility('SPECIFIC')">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.visibility === 'SPECIFIC' }"
              >
                <SpriteIcon
                  name="followers"
                  size="20"
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
            <button type="button" @click="toggleHideLikes()">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.hideLikes }"
              >
                <SpriteIcon
                  name="heart"
                  size="18"
                  color="#006145"
                  title="Hide Likes"
                />
              </div>
              <div class="infoIcon">
                <p>Hide like count</p>
              </div>
            </button>
            <button type="button" @click="toggleDisableComments()">
              <div
                class="btnIcon"
                :class="{ selected: createPostData.disableComments }"
              >
                <SpriteIcon
                  name="comment"
                  size="18"
                  color="#006145"
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
.dash-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  grid-template-rows: 100vh;
  overflow-y: hidden;
}
.dash-navside,
.dash-sidepanel,
.dash-content {
  padding: 10px 20px;
}

/* PROFILE SIDEPANEL */
.dash-sidepanel {
  background-color: #ffffff;
  color: #000000;
  overflow-y: auto;
}
.createPost h2,
.optionsPost h2,
.dash-myPosts h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  margin-bottom: 1rem;
}
.post-text,
.mediaPost button {
  background-color: rgb(255, 255, 255);
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
  border-radius: 10px;
}
.post-text textarea {
  width: 100%;
  height: 100px;
  border: none;
  resize: none;
  outline: none;
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  padding: 0.7rem;
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
.post-adds button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.mediaPost button {
  width: 100%;
  padding: 1rem 0;
  border: none;
  background-color: #006145;
  color: #ffffff;
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
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
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.btnIcon {
  background-color: #ffffff;
  padding: 0.3rem;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
  border-radius: 50px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8e8e8;
}
.modesOptions button:hover > .btnIcon {
  border: 1px solid #006145;
}
.modesOptions button:hover > .btnIcon svg {
  fill: #006145;
}
.btnIcon svg {
  fill: #868686;
}
.selected {
  background-color: #006145;
  border: 1px solid #006145;
}
.selected svg {
  fill: #ffffff !important;
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

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
}
</style>
