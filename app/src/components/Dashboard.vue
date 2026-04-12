<script setup lang="ts">
import { ref } from "vue";
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";

// NOTIFICATIONS
const ntfState = ref<boolean>(false);
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
      <div class="dash-ntf-base">
        <h2>Notifications</h2>
        <div class="dash-ntf-users" v-if="ntfState">
          <div class="ntf-user">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#000000"
              >
                <path
                  d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
                />
              </svg>
            </div>
            <div>
              <p><span>User Test</span> shared a new post.</p>
            </div>
          </div>
        </div>
        <div class="dash-ntf-empty" v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="64px"
            viewBox="0 -960 960 960"
            width="64px"
            fill="#e3e3e3"
          >
            <path
              d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
            />
          </svg>
          <div class="ntf-empty-text">
            <p>Activity On Your Posts</p>
            <p>No Activity.</p>
          </div>
        </div>
      </div>
      <div class="dash-fav-base">
        <div class="fav-head">
          <h2>Favorites</h2>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="#e3e3e3"
            >
              <path
                d="M288-600v-72h528v72H288Zm0 156v-72h528v72H288Zm0 156v-72h528v72H288ZM180-600q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-636q0 14-10.35 25T180-600Zm0 156q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-480q0 14-10.35 25T180-444Zm0 156q-14 0-25-11t-11-25.5q0-14.5 11-25t25.5-10.5q14.5 0 25 10.35T216-324q0 14-10.35 25T180-288Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="dash-content">
      <Post />
    </div>
  </div>
</template>

<style scoped>
.dash-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  grid-template-rows: 100vh;
}
.dash-navside,
.dash-sidepanel,
.dash-content {
  padding: 10px 20px;
}

.dash-sidepanel {
  background-color: #ffffff;
  color: #000000;
}
.dash-ntf-base h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.ntf-user {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  gap: 0.5rem;
}
.ntf-user span {
  font-family: "Montserrat SemiBold", sans-serif;
}
.ntf-user p {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.75rem;
}
.dash-ntf-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}
.ntf-empty-text {
  text-align: center;
}
.ntf-empty-text p:first-child {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 0.7rem;
}
.ntf-empty-text p:last-child {
  font-family: "Montserrat Medium", sans-serif;
  font-size: 0.7rem;
}

.fav-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.fav-head h2 {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.8rem;
}
.fav-head button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
.fav-head button:hover svg {
  fill: #006145;
}

.dash-content {
  background-color: #f4f4f4;
  color: #000000;
}
</style>
