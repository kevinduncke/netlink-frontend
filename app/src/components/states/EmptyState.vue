<script setup lang="ts">
import SpriteIcon from "../SpriteIcon.vue";

withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    icon?: string;
  }>(),
  {
    title: "Nothing here yet",
    message: "There is no data to show right now.",
    icon: "connections",
  },
);
</script>

<template>
  <section class="empty-state" aria-live="polite">
    <div class="empty-card shadow-light">
      <div class="empty-icon" aria-hidden="true">
        <SpriteIcon name="explore" size="22" color="#535353" title="Explore" />
      </div>
      <div class="empty-copy">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.empty-state {
  display: grid;
  place-items: center;
  margin: 2rem 0;
  padding: 0 20px;
}

.empty-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-md);
  background: var(--color-white);
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(180deg, #f8fafc, #eef2f7);
  flex-shrink: 0;
}

.empty-copy {
  flex: 1;
  min-width: 0;
}

.empty-copy h2 {
  margin: 0 0 0.2rem;
  font-family: "Montserrat Medium", sans-serif;
  font-size: var(--font-size-body-lg);
  color: var(--color-gray-800);
}

.empty-copy p {
  margin: 0;
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  color: var(--color-gray-600);
  line-height: 1.45;
}

@media (max-width: 560px) {
  .empty-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
