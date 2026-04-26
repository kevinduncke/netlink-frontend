<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import SpriteIcon from "./SpriteIcon.vue";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

const {
  // VARIABLES
  queryUsers,
  searchUsersResults,
  userChats,
  selectedChat,
  chatUserInfo,
  userChatId,
  displayUserInfo,
  message,

  // FUNCTIONS
  searchUsers,
  loadSuggestedUsers,
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
} = useUserData();

watch(queryUsers, searchUsers);

onMounted(async () => {
  await loadSuggestedUsers("following");
  await loadUserChats();
});
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-messages">
        <h2>New Chat</h2>
        <div class="dash-message-form">
          <span>To:</span>
          <input
            type="text"
            name="search"
            id="search-users"
            placeholder="Search..."
            v-model="queryUsers"
          />
          <div type="button" v-if="queryUsers.length <= 0">
            <SpriteIcon
              name="search"
              size="20"
              color="#006145"
              title="Add mention"
            />
          </div>
          <button type="button" v-else @click="clearQuery()">
            <img src="/icons/close.svg" alt="Check" width="18" height="18" />
          </button>
        </div>
        <div class="dash-users-modal" v-if="searchUsersResults.length > 0">
          <div
            class="dash-user-item dash-search-item"
            v-for="user in searchUsersResults"
            :key="user.id"
          >
            <button type="button" @click="verifyNewChatSearch(user.id)">
              <img
                src="../assets/avatars/40x40.png"
                alt="User Avatar"
                class="bar-user-avatar"
                height="40px"
                width="40px"
              />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ user.name }}</h2>
                <p class="bar-user-username">{{ user.username }}</p>
              </div>
            </button>
            <button type="button" @click="selectChat(user.id)">
              <SpriteIcon name="send" size="24" color="#e3e3e3" title="Send" />
            </button>
          </div>
        </div>
      </div>
      <div class="dash-chats" v-if="userChats.length > 0">
        <h2>Chats</h2>
        <div
          class="bar-user-box"
          :class="{ selected: chat.chatId === userChatId }"
          v-for="chat in userChats"
          :key="chat.chatId"
        >
          <button type="button" @click="selectChat(chat.chatId)">
            <div class="bar-user-info">
              <img
                src="../assets/avatars/40x40.png"
                alt="User Avatar"
                class="bar-user-avatar"
                height="40px"
                width="40px"
              />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ chat.receiver.name }}</h2>
                <p class="bar-user-username">@{{ chat.receiver.username }}</p>
              </div>
            </div>
          </button>
          <button type="button" @click="selectChat(chat.chatId)">
            <SpriteIcon name="send" size="24" color="#e3e3e3" title="Send" />
          </button>
        </div>
      </div>
      <div class="dash-suggestions">
        <h2>Suggestions</h2>
        <div
          class="bar-user-box"
          v-for="user in filteredSuggestedUsers"
          :key="user.id"
        >
          <button type="button" @click="createChat(user.id)">
            <div class="bar-user-info">
              <img
                src="../assets/avatars/40x40.png"
                alt="User Avatar"
                class="bar-user-avatar"
                height="40px"
                width="40px"
              />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ user.name }}</h2>
                <p class="bar-user-username">@{{ user.username }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-header-user" v-if="selectedChat">
        <div class="bar-user-box">
          <button type="button">
            <div class="bar-user-info">
              <img
                src="../assets/avatars/40x40.png"
                alt="User Avatar"
                class="bar-user-avatar"
                height="40px"
                width="40px"
              />
              <div class="bar-userdata">
                <h2 class="bar-user-name">{{ chatUserInfo.name }}</h2>
                <p class="bar-user-username">@{{ chatUserInfo.username }}</p>
              </div>
            </div>
          </button>
          <div class="bar-useractions">
            <button type="button">
              <SpriteIcon
                name="bell"
                size="24"
                color="#C5C5C5"
                title="Notifications"
              />
            </button>
            <button type="button" @click="deleteChat(userChatId)">
              <SpriteIcon
                name="trash"
                size="24"
                color="#C5C5C5"
                title="Delete Chat"
              />
            </button>
            <button type="button" @click="getUserInfo()">
              <SpriteIcon name="info" size="24" color="#C5C5C5" title="Info" />
            </button>
          </div>
        </div>
      </div>
      <div
        class="dash-body-msg"
        v-if="selectedChat"
        :class="{ 'dash-modal-info': displayUserInfo === true }"
      >
        <div
          v-if="!displayUserInfo"
          class="dash-date-group"
          v-for="(messages, date) in groupMessagesByDate"
          :key="date"
        >
          <div class="dash-date-msg">
            <span>{{ date }}</span>
          </div>
          <div v-for="msg in messages" :key="msg.id">
            <div
              class="dash-message-boxuser"
              v-if="msg.senderId === chatUserInfo.id"
            >
              <div class="dash-user-msg">
                <p>{{ msg.content }}</p>
                <time :datetime="msg.createdAt">
                  {{
                    new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </time>
              </div>
            </div>
            <div class="dash-message-boxme" v-else>
              <div class="dash-my-msg">
                <p>{{ msg.content }}</p>
                <time :datetime="msg.createdAt">
                  {{
                    new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </time>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="dash-data-box">
            <h2>Share Profile</h2>
            <button type="button">
              <SpriteIcon
                name="email"
                size="24"
                color="#e3e3e3"
                title="Share via Email"
              />
              <p>Share via Email</p>
            </button>
          </div>
          <div class="dash-data-box">
            <h2>Block User</h2>
            <button type="button">
              <SpriteIcon
                name="block"
                size="24"
                color="#e3e3e3"
                title="Block"
              />
              <p>Block</p>
            </button>
          </div>
          <div class="dash-data-box">
            <h2>About this Account</h2>
            <div class="dash-about-user">
              <SpriteIcon
                name="date"
                size="24"
                color="#e3e3e3"
                title="Date Joined"
              />
              <div>
                <p>Date Joined</p>
                <p>{{ dateJoinedUser }}</p>
              </div>
            </div>
            <div class="dash-about-user">
              <SpriteIcon
                name="link-url"
                size="24"
                color="#e3e3e3"
                title="URL"
              />
              <div>
                <p>URL</p>
                <p>https://netlink.local/{{ chatUserInfo.username }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dash-footer-user" v-if="selectedChat">
        <button type="button">
          <SpriteIcon name="emoji" size="24" color="#C5C5C5" title="Emoji" />
        </button>
        <input
          type="text"
          name="send-message"
          id="send-message"
          placeholder="Type a message..."
          v-model="message"
        />
        <div class="dash-msg-media">
          <button type="button" @click="sendMessage(userChatId)">
            <SpriteIcon name="send" size="24" color="#e3e3e3" title="Send" />
          </button>
          <button type="button">
            <SpriteIcon
              name="microphone"
              size="24"
              color="#C5C5C5"
              title="Microphone"
            />
          </button>
          <button type="button">
            <SpriteIcon name="photo" size="24" color="#C5C5C5" title="Photo" />
          </button>
        </div>
      </div>
      <div class="dash-empty-chats" v-else>
        <SpriteIcon name="messages" size="64" color="#006145" title="Messages" />
        <h2>Start a conversation</h2>
      </div>
    </div>
  </div>
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
.dash-messages h2,
.dash-chats h2,
.dash-suggestions h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}

.dash-message-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
  background-color: #f4f4f4;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  border-radius: 10px;
}
.dash-message-form span {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
}
.dash-message-form input {
  width: 100%;
  margin: 0 0.5rem;
  border: none;
  outline: none;
  padding: 0.5rem 0;
  background: transparent;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.dash-message-form button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}
.dash-message-form button:hover > svg {
  fill: #006145;
}
/* Remove autocomplete background color */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #f4f4f4 inset !important; /* Set to your background */
  box-shadow: 0 0 0px 1000px #f4f4f4 inset !important;
  -webkit-text-fill-color: #000 !important; /* Set to your text color */
  transition: background-color 5000s ease-in-out 0s;
}

.dash-chats,
.dash-suggestions {
  box-sizing: border-box;
  margin: 1.5rem 0;
}
.bar-user-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  padding: 0 1rem;
}
.bar-user-box button:first-child {
  width: 100%;
}
.bar-user-box button:last-child {
  width: auto;
}
.bar-user-box button:last-child svg:hover {
  fill: #006145;
}
.selected {
  border-radius: 10px;
  background-color: #efefef;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
}
.bar-user-info {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}
.bar-userdata h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  margin: 0.5rem 0;
  text-align: left;
}
.bar-userdata p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  margin: 0.5rem 0;
  text-align: left;
}
.bar-user-box button {
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
  cursor: pointer;
}
.bar-user-box:hover {
  border-radius: 10px;
  background-color: #efefef;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 26px -3px #e8e8e8;
}
.bar-user-box button:first-child:hover {
  color: #006145;
}
.bar-useractions {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bar-useractions button {
  cursor: pointer;
}
.bar-useractions button > svg:hover {
  fill: #006145;
}
.dash-user-item {
  padding: 0 1rem;
}
.dash-user-item button {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
}
.dash-user-item:hover {
  background-color: #f4f4f4;
  border-radius: 10px;
}
.dash-search-item {
  display: flex;
  box-sizing: border-box;
}
.dash-search-item button:last-child {
  display: flex;
  justify-content: flex-end;
}
.dash-search-item button:last-child > svg:hover {
  fill: #006145;
}

/* PROFILE CONTENT */
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.dash-header-user {
  background-color: #ffffff;
  border-radius: 10px;
  -webkit-box-shadow: -1px 3px 26px -3px #d3d3d3;
  box-shadow: -1px 3px 26px -3px #d3d3d3;
}
.dash-header-user .bar-user-box:hover {
  background-color: transparent;
  box-shadow: none;
  -webkit-box-shadow: none;
}
.dash-footer-user {
  background-color: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  -webkit-box-shadow: -1px 3px 26px -3px #b9b9b9;
  box-shadow: -1px 3px 26px -3px #b9b9b9;
  margin-bottom: 1rem;
}
.dash-footer-user button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}
.dash-footer-user input {
  width: 100%;
  margin: 0 1rem;
  border: none;
  background: transparent;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  outline: none;
}
.dash-footer-user button > svg:hover {
  fill: #006145;
}
.dash-msg-media {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.dash-msg-media button:first-child > svg {
  fill: #006145;
}
.dash-body-msg {
  height: 100%;
  overflow-y: auto;
}
.dash-date-group {
  padding: 1rem 0;
  text-align: center;
  box-sizing: border-box;
  margin-top: 1rem;
}
.dash-date-group span {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
  background-color: #c5c5c5;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 10px;
}
.dash-message-boxuser {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.dash-message-boxme {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.dash-user-msg {
  text-align: left;
}
.dash-my-msg {
  text-align: right;
}
.dash-user-msg,
.dash-my-msg {
  box-sizing: border-box;
  width: fit-content;
  background-color: #006145;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  margin: 1rem 0;
}
.dash-user-msg p,
.dash-my-msg p {
  padding: 0;
  margin: 0;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.7rem;
  padding-bottom: 0.2rem;
}
.dash-user-msg time,
.dash-my-msg time {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.5rem;
  letter-spacing: 0.05rem;
}
.dash-empty-chats {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dash-empty-chats h2 {
  font-family: "Montserrat Light", sans-serif;
  font-size: 1.25rem;
}

.dash-modal-info {
  background-color: #ffffff;
  border-radius: 10px;
  -webkit-box-shadow: -1px 3px 26px -3px #d3d3d3;
  box-shadow: -1px 3px 26px -3px #d3d3d3;
  margin: 1rem 0;
}
.dash-data-box h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
  padding: 1rem 1rem 0 1rem;
}
.dash-data-box button {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  padding: 0.5rem 0;
  background-color: #ffffff;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0 1rem;
}
.dash-data-box button:hover {
  background-color: #f3f3f3;
}
.dash-data-box button:hover > svg,
.dash-about-user:hover > svg {
  fill: #006145;
}
.dash-data-box button > p {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.dash-about-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  padding: 0 1rem;
}
.dash-about-user p:first-child {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
}
.dash-about-user p:last-child {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.75rem;
}
.dash-about-user:last-child {
  padding-bottom: 1rem;
}
</style>
