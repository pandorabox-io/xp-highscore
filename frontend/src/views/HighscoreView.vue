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

const PAGE_SIZE = 10;
const ONLINE_THRESHOLD = 30 * 1000;
const INACTIVE_THRESHOLD = 30 * 24 * 3600 * 1000;

const score = ref<HighscoreEntry[]>([]);
const ranks = ref<Rank[]>([]);
const skins = ref<SkinsDB>({});
const start = ref(0);
const sort = ref<SortColumn>("xp");
const order = ref<SortOrder>("desc");
const busy = ref(false);
const error = ref(false);

// header label, cell text and alignment of each sortable column, rendered in SORT_COLUMNS order
const sortColumns: Record<SortColumn, { label: string; cell: (p: HighscoreEntry) => string; numeric?: boolean }> = {
	xp: { label: "XP", cell: p => numberWithCommas(p.attributes.xp), numeric: true },
	digged_nodes: { label: "Dug", cell: p => numberWithCommas(p.attributes.digged_nodes), numeric: true },
	crafted: { label: "Crafted", cell: p => numberWithCommas(p.attributes.crafted), numeric: true },
	placed_nodes: { label: "Built", cell: p => numberWithCommas(p.attributes.placed_nodes), numeric: true },
	died: { label: "Deaths", cell: p => numberWithCommas(p.attributes.died), numeric: true },
	punch_count: { label: "Punches", cell: p => numberWithCommas(p.attributes.punch_count), numeric: true },
	inflicted_damage: { label: "Damage", cell: p => numberWithCommas(p.attributes.inflicted_damage), numeric: true },
	played_time: { label: "Play time", cell: p => humanizeSeconds(p.attributes.played_time) },
	joined: { label: "Joined", cell: p => humanizeMs(msSince(p.created)) + " ago" },
	online: { label: "Last seen", cell: p => isOnline(p) ? "online" : humanizeMs(msSince(p.modified)) + " ago" }
};

async function update() {
	busy.value = true;
	try {
		score.value = await getHighscore(start.value, sort.value, order.value);
		error.value = false;
	} catch (e) {
		console.error(e);
		error.value = true;
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
	start.value += PAGE_SIZE;
	update();
}

function previous() {
	start.value = Math.max(start.value - PAGE_SIZE, 0);
	update();
}

function changeSort(column: SortColumn, newOrder: SortOrder) {
	sort.value = column;
	order.value = newOrder;
	start.value = 0;
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
	<div class="scroll">
		<table>
			<thead>
				<tr>
					<th class="num">#</th>
					<th>Player</th>
					<template v-for="col in SORT_COLUMNS" :key="col">
						<th :class="{ num: sortColumns[col].numeric }">
							<SortButtons
								:column="col"
								:label="sortColumns[col].label"
								:sort="sort"
								:order="order"
								@change="changeSort"
							/>
						</th>
						<th v-if="col === 'xp'">Rank</th>
					</template>
				</tr>
			</thead>
			<tbody :class="{ loading: busy }">
				<tr
					v-for="(player, i) in score"
					:key="player.name"
					:class="{ inactive: isInactive(player) }"
					:title="isInactive(player) ? 'Inactive for over 30 days' : undefined"
				>
					<td class="num pos">{{ start + i + 1 }}</td>
					<td>
						<span class="player">
							<img class="pixelated" :src="playerImage(skins, player.name)" alt="">
							<span class="name">{{ player.name }}</span>
							<span v-if="isOnline(player)" class="dot" title="Online"></span>
						</span>
					</td>
					<template v-for="col in SORT_COLUMNS" :key="col">
						<td
							:class="{
								num: sortColumns[col].numeric,
								xp: col === 'xp',
								sorted: col === sort,
								'is-online': col === 'online' && isOnline(player)
							}"
						>
							{{ sortColumns[col].cell(player) }}
						</td>
						<td v-if="col === 'xp'"><RankLabel :ranks="ranks" :xp="player.attributes.xp" /></td>
					</template>
				</tr>
				<tr v-if="!score.length && !busy">
					<td class="empty" :colspan="SORT_COLUMNS.length + 3">
						{{ error ? "Could not load the highscore." : "No players here." }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<nav class="pager" aria-label="Pagination">
		<button type="button" :disabled="start === 0" @click="previous">← Previous</button>
		<span class="range">{{ start + 1 }}–{{ start + PAGE_SIZE }}</span>
		<button type="button" :disabled="score.length < PAGE_SIZE" @click="next">Next →</button>
	</nav>
</template>

<style scoped>
.scroll {
	overflow-x: auto;
	margin: 0 -8px;
}

table {
	width: 100%;
	border-collapse: collapse;
	font-variant-numeric: tabular-nums;
}

th,
td {
	padding: 10px 8px;
	text-align: left;
	vertical-align: middle;
	white-space: nowrap;
}

th {
	font-size: 12px;
	font-weight: 500;
	color: var(--muted);
	border-bottom: 1px solid var(--line);
}

td {
	border-bottom: 1px solid var(--line);
}

tbody tr:hover td {
	background: var(--hover);
}

tbody {
	transition: opacity 0.15s;
}

tbody.loading {
	opacity: 0.6;
}

.num {
	text-align: right;
}

.pos {
	color: var(--muted);
	width: 1%;
}

.player {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.player img {
	width: 12px;
	height: 24px;
}

.name {
	font-weight: 500;
}

.dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--online);
	box-shadow: 0 0 0 3px color-mix(in oklab, var(--online) 20%, transparent);
}

.xp {
	font-weight: 600;
}

td.sorted:not(.xp) {
	color: var(--fg);
	font-weight: 500;
}

td:not(.sorted, .xp, .num, :first-child, :nth-child(2)) {
	color: var(--muted);
}

td.is-online {
	color: var(--online) !important;
}

tr.inactive td {
	opacity: 0.5;
}

.empty {
	text-align: center;
	color: var(--muted);
	padding: 48px 8px;
}

.pager {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24px;
	margin-top: 24px;
	font-size: 13px;
}

.pager button {
	color: var(--muted);
}

.pager button:hover:not(:disabled) {
	color: var(--fg);
}

.pager button:disabled {
	opacity: 0.35;
	cursor: default;
}

.range {
	color: var(--muted);
	font-variant-numeric: tabular-nums;
}
</style>
