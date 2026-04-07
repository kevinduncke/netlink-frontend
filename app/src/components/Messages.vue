<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

import type { SearchUser } from "../types/search";
import type { FollowUser } from "../types/users";
import type { UserChat } from "../types/users";
import type { ChatMessage, ChatUser } from "../types/chat";

import Navigation from "./Navigation.vue";

const router = useRouter();
const authStore = useAuthStore();

// SEARCH USERS | SEARCH FILTERS
const query = ref("");
const results = ref<SearchUser[]>([]);
async function searchUsers() {
  try {
    const response = await api.get(`/users/search?query=${query.value}`);
    results.value = response.data;
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
    query.value = "";
    results.value = [];
  } else {
    createChat(userId);
  }
}
function clearQuery() {
  query.value = "";
  results.value = [];
}
watch(query, searchUsers);

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

// LOAD OF SUGGESTED USERS
const suggestedUsers = ref<FollowUser[]>([]);
async function loadSuggestedUsers() {
  try {
    const response = await api.get("/follow/following");
    suggestedUsers.value = response.data || [];
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

// LOAD CHAT BASED ON SELECTED USER
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

// SEND MESSAGE ON SELECTED USER
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

// CREATE A NEW CHAT WITH SELECTED USER
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

// DELETE CHAT WITH SELECTED USER
async function deleteChat(chatId: string | number) {
  try {
    await api.delete(`/chats/${chatId}`);
    selectedChat.value = "";
    chatMessages.value = [];
    userChatId.value = "";
    await loadUserChats();
    await loadSuggestedUsers();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
      return;
    }

    throw error;
  }
}

// INFORMATION ABOUT THE USER ACCOUNT
const displayUserInfo = ref<boolean>(false);
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
function getUserInfo() {
  displayUserInfo.value = !displayUserInfo.value;
}

onMounted(async () => {
  await loadSuggestedUsers();
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
            v-model="query"
          />
          <div type="button" v-if="query.length <= 0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#777777"
            >
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
              />
            </svg>
          </div>
          <button type="button" v-else @click="clearQuery()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#777777"
            >
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </button>
        </div>
        <div class="dash-users-modal" v-if="results.length > 0">
          <div
            class="dash-user-item dash-search-item"
            v-for="user in results"
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
            <button type="button" @click="verifyNewChatSearch(user.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
              >
                <path
                  d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
              >
                <path
                  d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"
                />
              </svg>
            </button>
            <button type="button" @click="deleteChat(userChatId)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
              >
                <path
                  d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                />
              </svg>
            </button>
            <button type="button" @click="getUserInfo()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#C5C5C5"
              >
                <path
                  d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"
                />
              </svg>
              <p>Share via Email</p>
            </button>
          </div>
          <div class="dash-data-box">
            <h2>Block User</h2>
            <button type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM480-160q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448ZM480-480Z"
                />
              </svg>
              <p>Block</p>
            </button>
          </div>
          <div class="dash-data-box"> 
            <h2>About this Account</h2>
            <div class="dash-about-user">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM480-160q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448ZM480-480Z"
                />
              </svg>
              <div>
                <p>Date Joined</p>
                <p>{{ dateJoinedUser }}</p>
              </div>
            </div>
            <div class="dash-about-user">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z"
                />
              </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#C5C5C5"
          >
            <path
              d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm263.5 221.5Q659-337 684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM480-480Zm227 227q93-93 93-227t-93-227q-93-93-227-93t-227 93q-93 93-93 227t93 227q93 93 227 93t227-93Z"
            />
          </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#C5C5C5"
            >
              <path
                d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"
              />
            </svg>
          </button>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#C5C5C5"
            >
              <path
                d="M395-435q-35-35-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35q-50 0-85-35Zm85-205Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm68.5-371.5Q520-503 520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480q17 0 28.5-11.5Z"
              />
            </svg>
          </button>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#C5C5C5"
            >
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="dash-empty-chats" v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="64px"
          viewBox="0 -960 960 960"
          width="64px"
          fill="#006145"
        >
          <path
            d="M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560ZM160-473l47-47h393v-280H160v327ZM80-280v-520q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240L80-280Zm80-240v-280 280Z"
          />
        </svg>
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
