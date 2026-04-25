<script setup lang="ts">
import { computed } from "vue";

type IconName =
  | "at"
  | "comment"
  | "dots"
  | "edit"
  | "heart"
  | "list"
  | "location"
  | "search"
  | "share"
  | "trash";

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: number | string;
    color?: string;
    title?: string;
  }>(),
  {
    size: 22,
  }
);

const normalizedSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);
</script>

<template>
  <svg
    class="sprite-icon"
    :style="{ width: normalizedSize, height: normalizedSize, color }"
    :role="title ? 'img' : 'presentation'"
    :aria-hidden="title ? 'false' : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <use :href="`/icons/sprite.svg#${name}`" />
  </svg>
</template>

<style scoped>
.sprite-icon {
  display: block;
  flex-shrink: 0;
  fill: currentColor;
}
</style>