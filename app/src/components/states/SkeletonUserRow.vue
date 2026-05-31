<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		count?: number;
	}>(),
	{
		count: 4,
	},
);

const skeletonRows = Array.from({ length: props.count });
</script>

<template>
	<div class="skeleton-user-rows" aria-busy="true" aria-live="polite">
		<article
			v-for="(_, index) in skeletonRows"
			:key="index"
			class="skeleton-user-row shadow-light"
		>
			<div class="skeleton-user-info">
				<div class="skeleton-avatar shimmer"></div>
				<div class="skeleton-user-copy">
					<div class="skeleton-line skeleton-name shimmer"></div>
					<div class="skeleton-line skeleton-handle shimmer"></div>
				</div>
			</div>
			<div class="skeleton-button shimmer"></div>
		</article>
	</div>
</template>

<style scoped>
.skeleton-user-rows {
	display: grid;
	gap: 0.85rem;
}

.skeleton-user-row {
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.9rem 1rem;
	border-radius: var(--radius-md);
	background: var(--color-white);
}

.skeleton-user-row::after {
	content: "";
	position: absolute;
	inset: 0;
	background: linear-gradient(
		90deg,
		transparent 0%,
		rgba(255, 255, 255, 0.12) 45%,
		rgba(255, 255, 255, 0.38) 50%,
		rgba(255, 255, 255, 0.12) 55%,
		transparent 100%
	);
	transform: translateX(-100%);
	animation: shimmer-slide 1.35s infinite;
	pointer-events: none;
}

.skeleton-user-info {
	display: flex;
	align-items: center;
	gap: 0.85rem;
	min-width: 0;
	flex: 1;
}

.skeleton-avatar {
	width: 40px;
	height: 40px;
	border-radius: 999px;
	flex-shrink: 0;
	background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
	background-size: 200% 100%;
}

.skeleton-user-copy {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	flex: 1;
}

.skeleton-line,
.skeleton-button {
	background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
	background-size: 200% 100%;
}

.skeleton-line {
	height: 12px;
	border-radius: 999px;
}

.skeleton-name {
	width: min(100%, 180px);
	height: 14px;
}

.skeleton-handle {
	width: min(72%, 130px);
}

.skeleton-button {
	width: 72px;
	height: 30px;
	border-radius: 999px;
	flex-shrink: 0;
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

@media (max-width: 520px) {
	.skeleton-user-row {
		align-items: flex-start;
		flex-direction: column;
	}

	.skeleton-button {
		width: 100%;
	}
}

@media (prefers-reduced-motion: reduce) {
	.skeleton-user-row::after,
	.shimmer {
		animation: none;
	}
}
</style>
