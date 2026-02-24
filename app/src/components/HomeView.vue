<script setup lang="ts"></script>

<template>
  <div class="home-base">
    <router-link to="/login">
      <img
        src="../assets/logos/netlink-logo.png"
        alt="Netlink Logo"
        height="150"
      />
    </router-link>
  </div>
</template>

<style scoped>
.home-base {
  background-color: #ffffff !important;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
