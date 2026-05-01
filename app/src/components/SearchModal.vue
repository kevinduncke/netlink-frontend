<script setup lang="ts">
// VUE
import { ref, watch } from "vue";

// SERVICES
import api from "../services/api";

// TYPES
import type { SearchUser } from "../types/search";

// COMPONENTS
import SpriteIcon from "./SpriteIcon.vue";

const props = defineProps({
  mode: { type: String, required: true },
  show: { type: Boolean, required: true },
});

const emit = defineEmits(["close", "select", "select-multiple"]);

const query = ref("");
const results = ref<SearchUser[]>([]);
const selectedUsers = ref<number[]>([]);

async function searchUsers() {
  const response = await api.get(`/users/search?query=${query.value}`);
  results.value = response.data;
}

watch(query, searchUsers);

function handleSelect(user: SearchUser) {
  if (props.mode === "mention") {
    emit("select", user.username);
  } else {
    // multi-select mode
    const index = selectedUsers.value.indexOf(user.id);

    if (index === -1) {
      // ADD USER
      selectedUsers.value.push(user.id);
    } else {
      // REMOVE USER
      selectedUsers.value.splice(index, 1);
    }
  }
}
</script>

<template>
  <div v-if="props.show" class="post-mnt-popup shadow-light">
    <div class="btn-mnt-exit">
      <button class="button" type="button" @click="emit('close')">
        <img src="/icons/close.svg" alt="Close" width="24" height="24" />
      </button>
    </div>
    <div class="input-mnt-search">
      <h2>Search in Netlink</h2>
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
      <div class="input-results" v-if="results.length > 0">
        <button
          class="button"
          v-for="user in results"
          :key="user.id"
          @click="handleSelect(user)"
        >
          {{ user.username }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* POP UP SEARCH */
.post-mnt-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3rem;
  width: 50%;
}
.btn-mnt-exit {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
.btn-mnt-exit button {
  outline: none;
}
.input-mnt-search {
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input-search {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  margin: 1rem 0 0 0;
  padding: 1rem 0.5rem;
}
.input-search input {
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  color: #000000;
}
.input-results {
  background-color: var(--color-white);
}
.input-results button {
  width: 100%;
  border-bottom: 1px solid var(--color-gray-50);
  outline: none;
  padding: var(--spacing-md) 2.5rem;
  text-align: left;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: left;
}
.input-results button:hover {
  background-color: var(--color-gray-100);
}
.input-results svg {
  padding-right: 1rem;
}
</style>
