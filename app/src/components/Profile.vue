<script setup lang="ts">
import Navigation from './Navigation.vue';
</script>

<template>
  <div class="dash-wrapper">
    <Navigation />
    <div class="dash-sidepanel">
        <div class="profile-edit">
            
        </div>
    </div>
    <div class="dash-content">

    </div>
  </div>
</template>

<style scoped>
.dash-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
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
.dash-title {
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 1rem;
}

.dash-content {
  background-color: #f4f4f4;
  color: #000000;
}
</style>
