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
}

export interface HighscoreEntry {
	name: string;
	created: string;
	modified: string;
	attributes: PlayerAttributes;
}

export interface SearchResult {
	name: string;
	creation_date: string;
	modification_date: string;
	xp: string;
}

export interface Rank {
	name: string;
	xp: number;
	icon: string;
	entityname: string;
	color: { r: number; g: number; b: number };
}

export type SkinsDB = Record<string, string>;

export type SortColumn =
	| "xp"
	| "digged_nodes"
	| "crafted"
	| "placed_nodes"
	| "died"
	| "punch_count"
	| "inflicted_damage"
	| "played_time"
	| "joined"
	| "online";

export type SortOrder = "asc" | "desc";
