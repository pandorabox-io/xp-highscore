<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import SortButtons from "../components/SortButtons.vue";
import RankLabel from "../components/RankLabel.vue";
import { getHighscore, getRanks, getSkinsDB } from "../api";
import { SORT_COLUMNS } from "#shared/types.ts";
import type { HighscoreEntry, Rank, SkinsDB, SortColumn, SortOrder } from "#shared/types.ts";
import {
	humanizeMs, humanizeSeconds, msSince, numberWithCommas, playerImage
} from "../util";

const ONLINE_THRESHOLD = 30 * 1000;
const INACTIVE_THRESHOLD = 30 * 24 * 3600 * 1000;

const score = ref<HighscoreEntry[]>([]);
const ranks = ref<Rank[]>([]);
const skins = ref<SkinsDB>({});
const start = ref(0);
const sort = ref<SortColumn>("xp");
const order = ref<SortOrder>("desc");
const busy = ref(false);

// header label and cell text of each sortable column, rendered in SORT_COLUMNS order
const sortColumns: Record<SortColumn, { label: string; cell: (p: HighscoreEntry) => string }> = {
	xp: { label: "XP", cell: p => numberWithCommas(p.attributes.xp) },
	digged_nodes: { label: "Dig-count", cell: p => numberWithCommas(p.attributes.digged_nodes) },
	crafted: { label: "Craft-count", cell: p => numberWithCommas(p.attributes.crafted) },
	placed_nodes: { label: "Build-count", cell: p => numberWithCommas(p.attributes.placed_nodes) },
	died: { label: "Death-count", cell: p => p.attributes.died ?? "" },
	punch_count: { label: "Punch-count", cell: p => numberWithCommas(p.attributes.punch_count) },
	inflicted_damage: { label: "Inflicted damage", cell: p => numberWithCommas(p.attributes.inflicted_damage) },
	played_time: { label: "Play-time", cell: p => humanizeSeconds(p.attributes.played_time) },
	joined: { label: "Joined", cell: p => humanizeMs(msSince(p.created)) },
	online: { label: "Last login", cell: p => humanizeMs(msSince(p.modified)) }
};

async function update() {
	busy.value = true;
	try {
		score.value = await getHighscore(start.value, sort.value, order.value);
	} catch (e) {
		console.error(e);
	} finally {
		busy.value = false;
	}
}

async function updateSkins() {
	try {
		skins.value = await getSkinsDB();
	} catch (e) {
		console.error(e);
	}
}

function next() {
	start.value += 10;
	update();
}

function previous() {
	start.value = Math.max(start.value - 10, 0);
	update();
}

function changeSort(column: SortColumn, newOrder: SortOrder) {
	sort.value = column;
	order.value = newOrder;
	update();
}

const isOnline = (p: HighscoreEntry) => msSince(p.modified) < ONLINE_THRESHOLD;
const isInactive = (p: HighscoreEntry) => msSince(p.modified) > INACTIVE_THRESHOLD;

const timers: number[] = [];

onMounted(() => {
	getRanks().then(r => ranks.value = r).catch(console.error);
	updateSkins();
	update();
	timers.push(window.setInterval(updateSkins, 15000));
	timers.push(window.setInterval(update, 10000));
});

onUnmounted(() => timers.forEach(clearInterval));
</script>

<template>
	<div>
		<div class="btn-group mb-3">
			<button class="btn btn-secondary btn-lg" @click="previous">
				<i class="fas fa-step-backward"></i> Previous
			</button>
			<button class="btn btn-secondary btn-lg" disabled>
				<i :class="busy ? 'fas fa-spinner fa-spin' : 'fas fa-check'"></i>
			</button>
			<button class="btn btn-secondary btn-lg" @click="next">
				Next <i class="fas fa-step-forward"></i>
			</button>
		</div>

		<div class="table-responsive">
			<table class="table table-sm table-striped align-middle">
				<thead>
					<tr>
						<th>Ranking</th>
						<th>Name</th>
						<template v-for="col in SORT_COLUMNS" :key="col">
							<th>
								{{ sortColumns[col].label }}
								<SortButtons
									:column="col"
									:sort="sort"
									:order="order"
									@change="changeSort"
								/>
							</th>
							<th v-if="col === 'xp'">Rank</th>
						</template>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(player, i) in score"
						:key="player.name"
						:class="{ 'table-success': isOnline(player) }"
					>
						<td><span class="badge bg-primary fs-6">{{ start + i + 1 }}</span></td>
						<td class="text-nowrap">
							<img class="player-img" :src="playerImage(skins, player.name)" :alt="player.name">
							{{ player.name }}
						</td>
						<template v-for="col in SORT_COLUMNS" :key="col">
							<td>
								<span v-if="col === 'xp'" class="badge bg-info text-dark">{{ sortColumns[col].cell(player) }}</span>
								<template v-else>{{ sortColumns[col].cell(player) }}</template>
								<span v-if="col === 'online' && isInactive(player)" class="badge bg-secondary">Inactive</span>
							</td>
							<td v-if="col === 'xp'"><RankLabel :ranks="ranks" :xp="player.attributes.xp" /></td>
						</template>
						<td>
							<span v-if="isOnline(player)" class="badge bg-success">Online</span>
							<span v-else class="badge bg-danger">Offline</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
