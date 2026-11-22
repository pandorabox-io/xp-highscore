<script setup lang="ts">
import { computed } from "vue";
import type { Rank } from "#shared/types.ts";
import { getRank, rankColor } from "../util";

const props = defineProps<{
	ranks: Rank[];
	xp: string | number | undefined;
}>();

const rank = computed(() => getRank(props.ranks, props.xp));
</script>

<template>
	<span v-if="rank" class="rank" :style="{ '--rank': rankColor(rank) }">
		<img class="pixelated" :src="`api/texture/${rank.icon}`" alt="">
		{{ rank.name }}
	</span>
</template>

<style scoped>
.rank {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	white-space: nowrap;
	/* blend the rank color with the text color so light ranks stay readable on light backgrounds */
	color: color-mix(in oklab, var(--rank) 65%, var(--fg));
}

img {
	width: 16px;
	height: 16px;
}
</style>
