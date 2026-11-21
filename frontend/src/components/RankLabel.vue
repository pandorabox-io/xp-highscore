<script setup lang="ts">
import { computed } from "vue";
import type { Rank } from "../types";
import { getRank, rankColor } from "../util";

const props = defineProps<{
	ranks: Rank[];
	xp: string | number | undefined;
}>();

const rank = computed(() => getRank(props.ranks, props.xp));
</script>

<template>
	<span v-if="rank" class="text-nowrap">
		<img :src="`api/texture/${rank.icon}`" :alt="rank.name">
		<span class="ms-1" :style="{ color: rankColor(rank) }">{{ rank.name }}</span>
	</span>
</template>
