<script setup lang="ts">
import HighscoreView from "./views/HighscoreView.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
</script>

<template>
	<nav class="navbar navbar-dark bg-dark navbar-expand mb-3 px-3">
		<span class="navbar-brand">Pandorabox Highscore</span>
		<div class="ms-auto">
			<ThemeSwitcher />
		</div>
	</nav>
	<div class="container-fluid">
		<HighscoreView />
	</div>
</template>
