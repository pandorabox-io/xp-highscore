import type { HighscoreEntry, Rank, SkinsDB, SortColumn, SortOrder } from "#shared/types.ts";

async function get<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`request to ${url} failed: ${res.status}`);
	}
	return res.json() as Promise<T>;
}

export function getHighscore(start: number, sort: SortColumn, order: SortOrder): Promise<HighscoreEntry[]> {
	const params = new URLSearchParams({ start: String(start), sort, order });
	return get(`api/highscore?${params}`);
}

export function getRanks(): Promise<Rank[]> {
	return get("api/ranks");
}

export function getSkinsDB(): Promise<SkinsDB> {
	return get("api/skinsdb");
}

