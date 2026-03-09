<script setup lang="ts"></script>

<template>
  <div>
    Page Not Found
    <p>{{ $route.params.pathMatch  }}</p>
  </div>
</template>