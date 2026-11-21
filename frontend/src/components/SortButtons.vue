<script setup lang="ts">
import type { SortColumn, SortOrder } from "../types";

const props = defineProps<{
	column: SortColumn;
	sort: SortColumn;
	order: SortOrder;
}>();

const emit = defineEmits<{
	change: [column: SortColumn, order: SortOrder];
}>();

function btnClass(order: SortOrder): string {
	const active = props.sort === props.column && props.order === order;
	return active ? "btn btn-sm btn-primary" : "btn btn-sm btn-secondary";
}
</script>

<template>
	<div class="btn-group ms-1">
		<button :class="btnClass('desc')" title="Descending" @click="emit('change', column, 'desc')">
			<i class="fas fa-sort-amount-up"></i>
		</button>
		<button :class="btnClass('asc')" title="Ascending" @click="emit('change', column, 'asc')">
			<i class="fas fa-sort-amount-down"></i>
		</button>
	</div>
</template>
