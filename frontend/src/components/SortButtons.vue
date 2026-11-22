<script setup lang="ts">
import type { SortColumn, SortOrder } from "#shared/types.ts";

const props = defineProps<{
	column: SortColumn;
	label: string;
	sort: SortColumn;
	order: SortOrder;
}>();

const emit = defineEmits<{
	change: [column: SortColumn, order: SortOrder];
}>();

// first click sorts descending, clicking the active column flips the order
function toggle() {
	const active = props.sort === props.column;
	emit("change", props.column, active && props.order === "desc" ? "asc" : "desc");
}
</script>

<template>
	<button
		type="button"
		:class="{ active: sort === column }"
		:aria-label="`Sort by ${label}`"
		@click="toggle"
	>
		{{ label }}<span class="arrow">{{ sort === column && order === "asc" ? "↑" : "↓" }}</span>
	</button>
</template>

<style scoped>
button {
	white-space: nowrap;
	color: inherit;
}

button:hover,
button.active {
	color: var(--fg);
}

.arrow {
	display: inline-block;
	width: 1em;
	margin-left: 2px;
	visibility: hidden;
}

button:hover .arrow {
	visibility: visible;
	opacity: 0.4;
}

button.active .arrow {
	visibility: visible;
	opacity: 1;
}
</style>
