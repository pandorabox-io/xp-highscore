<script setup lang="ts">
import { onMounted, ref } from "vue";
import RankLabel from "../components/RankLabel.vue";
import { getRanks, getSkinsDB, searchPlayer } from "../api";
import type { Rank, SearchResult, SkinsDB } from "../types";
import { humanizeMs, msSince, numberWithCommas, playerImage } from "../util";

const query = ref("");
const results = ref<SearchResult[] | null>(null);
const ranks = ref<Rank[]>([]);
const skins = ref<SkinsDB>({});
const busy = ref(false);

async function search() {
	const name = query.value.trim();
	if (!name) {
		results.value = null;
		return;
	}
	busy.value = true;
	try {
		results.value = await searchPlayer(name);
	} catch (e) {
		console.error(e);
	} finally {
		busy.value = false;
	}
}

onMounted(() => {
	getRanks().then(r => ranks.value = r).catch(console.error);
	getSkinsDB().then(s => skins.value = s).catch(console.error);
});
</script>

<template>
	<div>
		<form class="input-group mb-3" style="max-width: 30rem" @submit.prevent="search">
			<input v-model="query" class="form-control" placeholder="Player name" autofocus>
			<button class="btn btn-primary" type="submit" :disabled="busy">
				<i :class="busy ? 'fas fa-spinner fa-spin' : 'fas fa-search'"></i> Search
			</button>
		</form>

		<p v-if="results && results.length === 0" class="text-muted">No players found</p>

		<table v-if="results && results.length > 0" class="table table-sm table-striped align-middle">
			<thead>
				<tr>
					<th>Name</th>
					<th>XP</th>
					<th>Rank</th>
					<th>Joined</th>
					<th>Last login</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="player in results" :key="player.name">
					<td class="text-nowrap">
						<img class="player-img" :src="playerImage(skins, player.name)" :alt="player.name">
						{{ player.name }}
					</td>
					<td><span class="badge bg-info text-dark">{{ numberWithCommas(player.xp) }}</span></td>
					<td><RankLabel :ranks="ranks" :xp="player.xp" /></td>
					<td>{{ humanizeMs(msSince(player.creation_date)) }}</td>
					<td>{{ humanizeMs(msSince(player.modification_date)) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
