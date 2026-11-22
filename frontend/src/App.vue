<script setup lang="ts">
import HighscoreView from "./views/HighscoreView.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
</script>

<template>
	<main class="page">
		<header class="header">
			<h1>Pandorabox <span>Highscore</span></h1>
			<ThemeSwitcher />
		</header>
		<HighscoreView />
	</main>
</template>

<style scoped>
.header {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 32px;
}

h1 {
	margin: 0;
	font-size: 22px;
	font-weight: 600;
	letter-spacing: -0.01em;
}

h1 span {
	color: var(--muted);
	font-weight: 400;
}
</style>
