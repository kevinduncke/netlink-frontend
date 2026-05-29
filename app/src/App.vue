<script setup lang="ts">
import { PiniaColadaDevtools } from "@pinia/colada-devtools";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <router-view></router-view>
  <PiniaColadaDevtools />

  <Toaster position="top-right" />
</template>

<style scoped></style>
