<script setup lang="ts">
// VUE
import { onMounted, watch } from "vue";

// COMPONENTS
import Navigation from "./Navigation.vue";
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/app-layout.css";
import "../styles/input.css";
import "../styles/about.css";

// USER COMPOSITION
import { useUserData } from "../shared/userData";

const {
  // VARIABLES
  queryUsers,
  searchUsersResults,
  userChats,
  chatMessages,
  selectedChat,
  userChatId,
  chatUserInfo,
  displayUserInfo,
  dateConverter,
  message,

  // FUNCTIONS
  searchUsers,
  loadSuggestedUsers,
  loadUserChats,
  filteredSuggestedUsers,
  selectChat,
  getUserInfo,
  groupMessagesByDate,
  verifyNewChatSearch,
  clearQuery,
  sendMessage,
  createChat,
  deleteChat,
} = useUserData();

watch(queryUsers, searchUsers);

onMounted(async () => {
  // RESET ALL CHAT-RELATED DATA
  selectedChat.value = "";
  chatMessages.value = [];
  await loadSuggestedUsers("following");
  await loadUserChats();
});
</script>

<template>
  <div class="app-layout">
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
              color="#535353"
              title="Add mention"
            />
          </div>
          <button class="button" type="button" v-else @click="clearQuery()">
            <img src="/icons/close.svg" alt="Check" width="18" height="18" />
          </button>
        </div>
        <div class="dash-users-modal" v-if="searchUsersResults.length > 0">
          <div
            class="dash-user-item dash-search-item"
            v-for="user in searchUsersResults"
            :key="user.id"
          >
            <button
              class="button"
              type="button"
              @click="verifyNewChatSearch(user.id)"
            >
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
            <button class="button" type="button" @click="selectChat(user.id)">
              <SpriteIcon name="send" size="24" color="#e3e3e3" title="Send" />
            </button>
          </div>
        </div>
      </div>
      <div class="dash-chats" v-if="userChats.length > 0">
        <h2>Chats</h2>
        <div
          class="bar-user-box shadow-light"
          :class="{ selected: chat.id === userChatId }"
          v-for="chat in userChats"
          :key="chat.id"
        >
          <button class="button" type="button" @click="selectChat(chat.id)">
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
          <button class="button" type="button" @click="selectChat(chat.id)">
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
          v-if="filteredSuggestedUsers.length > 0"
        >
          <button class="button" type="button" @click="createChat(user.id)">
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
        <div class="dash-empty-suggestions" v-else>
          <SpriteIcon
            name="connections"
            size="48"
            color="#535353"
            title="Connections"
          />
          <h2>No suggestions available</h2>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-header-user" v-if="selectedChat">
        <div class="bar-user-box">
          <button class="button" type="button">
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
            <button class="button" type="button">
              <SpriteIcon
                name="bell"
                size="24"
                color="#535353"
                title="Notifications"
              />
            </button>
            <button
              class="button"
              type="button"
              @click="deleteChat(userChatId)"
            >
              <SpriteIcon
                name="trash"
                size="24"
                color="#535353"
                title="Delete Chat"
              />
            </button>
            <button class="button" type="button" @click="getUserInfo()">
              <SpriteIcon name="info" size="24" color="#535353" title="Info" />
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
            <h2>About this Account</h2>
            <div class="dash-about-user">
              <SpriteIcon
                name="date"
                size="24"
                color="#535353"
                title="Date Joined"
              />
              <div>
                <p>Date Joined</p>
                <p>{{ dateConverter(chatUserInfo.createdAt) }}</p>
              </div>
            </div>
            <div class="dash-about-user">
              <SpriteIcon
                name="link-url"
                size="24"
                color="#535353"
                title="URL"
              />
              <div>
                <p>URL</p>
                <p>https://netlink.local/{{ chatUserInfo.username }}</p>
              </div>
            </div>
          </div>
          <div class="dash-data-box">
            <h2>Block User</h2>
            <button class="button" type="button">
              <SpriteIcon
                name="block"
                size="24"
                color="#535353"
                title="Block"
              />
              <p>Block</p>
            </button>
          </div>
          <div class="dash-data-box">
            <h2>Share Profile</h2>
            <button class="button" type="button">
              <SpriteIcon
                name="email"
                size="24"
                color="#535353"
                title="Share via Email"
              />
              <p>Share via Email</p>
            </button>
          </div>
        </div>
      </div>
      <div class="dash-footer-user shadow-light" v-if="selectedChat">
        <button class="button" type="button">
          <SpriteIcon name="emoji" size="24" color="#535353" title="Emoji" />
        </button>
        <input
          type="text"
          name="send-message"
          id="send-message"
          placeholder="Type a message..."
          v-model="message"
          @keyup.enter="sendMessage(userChatId)"
        />
        <div class="dash-msg-media">
          <button class="button" type="button" @click="sendMessage(userChatId)">
            <SpriteIcon name="send" size="24" color="#535353" title="Send" />
          </button>
          <button class="button" type="button">
            <SpriteIcon
              name="microphone"
              size="24"
              color="#535353"
              title="Microphone"
            />
          </button>
          <button class="button" type="button">
            <SpriteIcon name="photo" size="24" color="#535353" title="Photo" />
          </button>
        </div>
      </div>
      <div class="dash-empty-chats" v-else>
        <SpriteIcon
          name="messages"
          size="64"
          color="#535353"
          title="Messages"
        />
        <h2>Start a conversation</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-message-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: var(--spacing-md) 0;
  background-color: var(--color-gray-100);
  padding: var(--spacing-sm) var(--spacing-md);
  box-sizing: border-box;
  border-radius: var(--radius-md);
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
  padding: 0;
}
.dash-message-form button:hover > svg {
  fill: var(--color-primary);
}
.dash-chats,
.dash-suggestions {
  box-sizing: border-box;
  margin: 1.5rem 0;
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
.bar-useractions {
  display: flex;
  gap: var(--spacing-md);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bar-useractions button > svg:hover {
  fill: var(--color-primary);
}
.dash-user-item {
  padding: 0 1rem;
}
.dash-user-item button {
  outline: none;
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.dash-user-item:hover {
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
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
  display: flex;
  flex-direction: column;
}
.dash-header-user {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
}
.dash-header-user .bar-user-box:hover {
  background-color: transparent;
  box-shadow: none;
  -webkit-box-shadow: none;
}
.dash-footer-user {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}
.dash-footer-user button {
  padding: 0;
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
  fill: var(--color-primary);
}
.dash-msg-media {
  display: flex;
  gap: var(--spacing-md);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.dash-msg-media button:first-child > svg {
  fill: var(--color-primary);
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
  background-color: var(--color-gray-500);
  color: var(--color-white);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
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
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin: var(--spacing-md) 0;
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
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  margin: var(--spacing-md) 0;
}
</style>
