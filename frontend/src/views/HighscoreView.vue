<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import SortButtons from "../components/SortButtons.vue";
import RankLabel from "../components/RankLabel.vue";
import { getHighscore, getRanks, getSkinsDB } from "../api";
import type { HighscoreEntry, Rank, SkinsDB, SortColumn, SortOrder } from "../types";
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

const columns: { label: string; sort?: SortColumn }[] = [
	{ label: "Ranking" },
	{ label: "Name" },
	{ label: "XP", sort: "xp" },
	{ label: "Rank" },
	{ label: "Dig-count", sort: "digged_nodes" },
	{ label: "Craft-count", sort: "crafted" },
	{ label: "Build-count", sort: "placed_nodes" },
	{ label: "Death-count", sort: "died" },
	{ label: "Punch-count", sort: "punch_count" },
	{ label: "Inflicted damage", sort: "inflicted_damage" },
	{ label: "Play-time", sort: "played_time" },
	{ label: "Joined", sort: "joined" },
	{ label: "Last login", sort: "online" },
	{ label: "Status" }
];

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
						<th v-for="col in columns" :key="col.label">
							{{ col.label }}
							<SortButtons
								v-if="col.sort"
								:column="col.sort"
								:sort="sort"
								:order="order"
								@change="changeSort"
							/>
						</th>
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
						<td><span class="badge bg-info text-dark">{{ numberWithCommas(player.attributes.xp) }}</span></td>
						<td><RankLabel :ranks="ranks" :xp="player.attributes.xp" /></td>
						<td>{{ numberWithCommas(player.attributes.digged_nodes) }}</td>
						<td>{{ numberWithCommas(player.attributes.crafted) }}</td>
						<td>{{ numberWithCommas(player.attributes.placed_nodes) }}</td>
						<td>{{ player.attributes.died }}</td>
						<td>{{ numberWithCommas(player.attributes.punch_count) }}</td>
						<td>{{ numberWithCommas(player.attributes.inflicted_damage) }}</td>
						<td>{{ humanizeSeconds(player.attributes.played_time) }}</td>
						<td>{{ humanizeMs(msSince(player.created)) }}</td>
						<td>
							{{ humanizeMs(msSince(player.modified)) }}
							<span v-if="isInactive(player)" class="badge bg-secondary">Inactive</span>
						</td>
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
