<script setup lang="ts">
import { themeMode, type ThemeMode } from "../theme";

const modes: { mode: ThemeMode; icon: string; label: string }[] = [
	{ mode: "light", icon: "fas fa-sun", label: "Light" },
	{ mode: "auto", icon: "fas fa-circle-half-stroke", label: "Auto (system)" },
	{ mode: "dark", icon: "fas fa-moon", label: "Dark" }
];
</script>

<template>
	<div class="btn-group" role="group" aria-label="Color theme">
		<button
			v-for="m in modes"
			:key="m.mode"
			type="button"
			:class="['btn btn-sm', themeMode === m.mode ? 'btn-light' : 'btn-outline-light']"
			:title="m.label"
			:aria-label="m.label"
			:aria-pressed="themeMode === m.mode"
			@click="themeMode = m.mode"
		>
			<i :class="m.icon"></i>
		</button>
	</div>
</template>
