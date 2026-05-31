<script setup lang="ts">
const skeletonPosts = Array.from({ length: 3 });
</script>

<template>
  <div class="skeleton-posts" aria-busy="true" aria-live="polite">
    <article
      v-for="(_, index) in skeletonPosts"
      :key="index"
      class="skeleton-post shadow-light"
    >
      <div class="skeleton-header">
        <div class="skeleton-avatar shimmer"></div>
        <div class="skeleton-user">
          <div class="skeleton-line skeleton-name shimmer"></div>
          <div class="skeleton-line skeleton-handle shimmer"></div>
        </div>
      </div>

      <div class="skeleton-content">
        <div class="skeleton-line skeleton-text shimmer"></div>
        <div class="skeleton-line skeleton-text short shimmer"></div>
      </div>

      <div class="skeleton-actions">
        <div class="skeleton-dots shimmer"></div>
        <div class="skeleton-dots shimmer"></div>
        <div class="skeleton-dots shimmer"></div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.skeleton-posts {
  display: grid;
  gap: 1rem;
}

.skeleton-post {
  position: relative;
  overflow: hidden;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--color-white);
  border: 1px solid rgba(83, 83, 83, 0.08);
}

.skeleton-post::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 45%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.15) 55%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: shimmer-slide 1.35s infinite;
  pointer-events: none;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.75rem;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
}

.skeleton-user {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.skeleton-dots {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
}

.skeleton-content {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.skeleton-line {
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
}

.skeleton-name {
  width: 42%;
  height: 16px;
}

.skeleton-handle {
  width: 28%;
  height: 12px;
}

.skeleton-text {
  width: 100%;
}

.skeleton-text.short {
  width: 72%;
}

.skeleton-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.shimmer {
  animation: shimmer-pulse 1.35s ease-in-out infinite;
}

@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes shimmer-pulse {
  0%,
  100% {
    opacity: 0.72;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-post::after,
  .shimmer {
    animation: none;
  }
}
</style>
