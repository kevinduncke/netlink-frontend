<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    retryLabel?: string;
  }>(),
  {
    title: "Something went wrong",
    message: "We could not load the data right now.",
    retryLabel: "Try again",
  },
);

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <section class="error-state" aria-live="assertive">
    <div class="error-card shadow-light">
      <div class="error-icon" aria-hidden="true">
        <span>!</span>
      </div>
      <div class="error-copy">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
      </div>
      <button class="button error-action" type="button" @click="emit('retry')">
        {{ retryLabel }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.error-state {
  display: grid;
  place-items: center;
  margin: 2rem 0;
  padding: 0 20px;
}

.error-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-md);
  background: var(--color-white);
}

.error-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fef2f2, #fee2e2);
  color: var(--color-error);
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.error-copy {
  flex: 1;
  min-width: 0;
}

.error-copy h2 {
  margin: 0 0 0.2rem;
  font-family: "Montserrat Medium", sans-serif;
  font-size: var(--font-size-body-lg);
  color: var(--color-gray-800);
}

.error-copy p {
  margin: 0;
  font-family: "Montserrat Regular", sans-serif;
  font-size: var(--font-size-body);
  color: var(--color-gray-600);
  line-height: 1.45;
}

.error-action {
  flex-shrink: 0;
  white-space: nowrap;
  padding: var(--padding-sm) var(--padding-md);
  border: 2px solid var(--color-gray-100);
  color: var(--color-gray-600);
  border-radius: var(--radius-md);
  cursor: pointer;
}
.error-action:hover {
  border-color: #fee2e2;
  color: var(--color-gray-800);
}

@media (max-width: 560px) {
  .error-card {
    align-items: flex-start;
    flex-direction: column;
  }
  .error-action {
    width: 100%;
  }
}
</style>
