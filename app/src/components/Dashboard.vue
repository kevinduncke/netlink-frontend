<script setup lang="ts">
import Navigation from "./Navigation.vue";
import Post from "./Post.vue";
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel"></div>
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
.dash-content {
  background-color: #f4f4f4;
  color: #000000;
}
</style>