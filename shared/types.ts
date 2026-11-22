// API contract shared between the backend (src/) and the frontend (frontend/src/)

export interface PlayerAttributes {
	name: string;
	xp?: string;
	digged_nodes?: string;
	crafted?: string;
	placed_nodes?: string;
	died?: string;
	punch_count?: string;
	inflicted_damage?: string;
	played_time?: string;
	"homedecor:player_skin"?: string;
}

export interface PlayerInfo {
	name: string;
	// ISO 8601 timestamps
	created: string;
	modified: string;
	attributes: PlayerAttributes;
}

export type HighscoreEntry = PlayerInfo;

export interface Rank {
	name: string;
	xp: number;
	icon: string;
	entityname: string;
	color: { r: number; g: number; b: number };
}

export type SkinsDB = Record<string, string>;

export const SORT_COLUMNS = [
	"xp",
	"digged_nodes",
	"crafted",
	"placed_nodes",
	"died",
	"punch_count",
	"inflicted_damage",
	"played_time",
	"joined",
	"online"
] as const;

export type SortColumn = typeof SORT_COLUMNS[number];

export function isSortColumn(value: unknown): value is SortColumn {
	return typeof value === "string" && (SORT_COLUMNS as readonly string[]).includes(value);
}

export type SortOrder = "asc" | "desc";
