<script setup lang="ts">
import { ref, watch } from "vue";
import api from "../services/api";

interface SearchUser {
  id: number;
  username: string;
}

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

    if(index === -1) {
        // ADD USER
        selectedUsers.value.push(user.id);
    } else {
        // REMOVE USER
        selectedUsers.value.splice(index, 1);
    }
    // if (!selectedUsers.value.includes(user.id)) {
    //   selectedUsers.value.push(user.id);
    // }
  }
}
</script>

<template>
  <div v-if="props.show" class="post-mnt-popup">
    <div class="btn-mnt-exit">
      <button type="button" @click="emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#C5C5C5"
        >
          <path
            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
          />
        </svg>
      </button>
    </div>
    <div class="input-mnt-search">
      <h2>Search in Netlink</h2>
      <div class="input-search">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="#C5C5C5"
          >
            <path
              d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
            />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for a user"
          v-model="query"
        />
      </div>
      <div class="input-results">
        <button
          v-for="user in results"
          :key="user.id"
          @click="handleSelect(user)"
        >
          <svg
            v-if="selectedUsers.includes(user.id)"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#006145"
          >
            <path
              d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
            />
          </svg>        
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#f4f4f4"
          >
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"
            />
          </svg>
          {{ user.username }}
        </button>
      </div>
      <div v-if="props.mode === 'specific'" class="input-results btn-add">
        <button type="button" @click="emit('select-multiple', selectedUsers)">
          Add Selected
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
  -webkit-box-shadow: -1px 3px 26px -3px #646464;
  box-shadow: -1px 3px 56px -3px #646464;
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
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}
.input-mnt-search {
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input-mnt-search h2 {
  font-family: "Montserrat Light", sans-serif;
  font-size: 0.8rem;
  color: #000000;
}
.input-search {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  margin: 1rem 0 0 0;
  -webkit-box-shadow: -1px 3px 26px -3px #e8e8e8;
  box-shadow: -1px 3px 56px -3px #c5c5c5;
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
  background-color: #ffffff;
}
.input-results button {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f9f9f9;
  outline: none;
  padding: 1rem 2.5rem;
  text-align: left;
  cursor: pointer;
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: left;
}
.input-results button:hover {
  background-color: #f4f4f4;
}
.input-results svg {
  padding-right: 1rem;
}
</style>
