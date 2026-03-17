<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import Navigation from './Navigation.vue';

// COMPONENT DEACTIVATION GUARD FOR UNSAVED CHANGES
onBeforeRouteLeave((to, from, next) => {
  // CHECK IF THERE ARE UNSAVED CHANGES
  if(hasUnsavedChanges()) {
    const answer = window.confirm("You have unsaved changes. Do you really want to leave?");
    if(answer){
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

function hasUnsavedChanges(){
  return true; // REPLACE WITH ACTUAL LOGIC TO CHECK FOR UNSAVED CHANGES
}
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
