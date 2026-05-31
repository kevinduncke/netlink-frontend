<script setup lang="ts">
withDefaults(
	defineProps<{
		title?: string;
		description?: string;
	}>(),
	{
		title: "Loading",
		description: "Please wait while we fetch the latest data.",
	},
);
</script>

<template>
	<section class="loading-state" aria-busy="true" aria-live="polite">
		<div class="loading-card shadow-light">
			<div class="loading-spinner" aria-hidden="true">
				<span></span>
				<span></span>
			</div>
			<div class="loading-copy">
				<h2>{{ title }}</h2>
				<p>{{ description }}</p>
			</div>
		</div>
	</section>
</template>

<style scoped>
.loading-state {
	display: grid;
	place-items: center;
	min-height: 220px;
	padding: 1rem;
}

.loading-card {
	display: flex;
	align-items: center;
	gap: 1rem;
	width: min(100%, 420px);
	padding: 1rem 1.1rem;
	border-radius: var(--radius-md);
	background: var(--color-white);
	border: 1px solid rgba(83, 83, 83, 0.08);
}

.loading-spinner {
	position: relative;
	width: 44px;
	height: 44px;
	flex-shrink: 0;
}

.loading-spinner span {
	position: absolute;
	inset: 0;
	border-radius: 999px;
	border: 3px solid rgba(0, 97, 69, 0.16);
	border-top-color: var(--color-primary);
	animation: spin 0.9s linear infinite;
}

.loading-spinner span:last-child {
	inset: 9px;
	border-width: 2px;
	animation-direction: reverse;
	animation-duration: 1.2s;
	border-top-color: rgba(0, 97, 69, 0.42);
}

.loading-copy h2 {
	margin: 0 0 0.2rem;
	font-family: "Montserrat Medium", sans-serif;
	font-size: 1rem;
	color: var(--color-gray-800);
}

.loading-copy p {
	margin: 0;
	font-family: "Montserrat Regular", sans-serif;
	font-size: 0.85rem;
	color: var(--color-gray-600);
	line-height: 1.45;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@media (prefers-reduced-motion: reduce) {
	.loading-spinner span {
		animation: none;
	}
}
</style>
