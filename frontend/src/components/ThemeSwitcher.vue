<script setup lang="ts">
import { themeMode, type ThemeMode } from "../theme";

const modes: ThemeMode[] = ["light", "auto", "dark"];
</script>

<template>
	<div class="switcher" role="group" aria-label="Color theme">
		<button
			v-for="m in modes"
			:key="m"
			type="button"
			:class="{ active: themeMode === m }"
			:aria-pressed="themeMode === m"
			@click="themeMode = m"
		>
			{{ m }}
		</button>
	</div>
</template>

<style scoped>
.switcher {
	display: flex;
	gap: 12px;
	font-size: 12px;
}

button {
	color: var(--muted);
}

button:hover {
	color: var(--fg);
}

button.active {
	color: var(--fg);
	text-decoration: underline;
	text-underline-offset: 4px;
}
</style>
