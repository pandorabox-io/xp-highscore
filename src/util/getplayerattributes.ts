import pool from "../pool.ts";
import type { PlayerAttributes } from "#shared/types.ts";

const ATTRIBUTES = [
	"crafted",
	"placed_nodes",
	"died",
	"digged_nodes",
	"xp",
	"played_time",
	"punch_count",
	"inflicted_damage",
	"homedecor:player_skin"
] as const satisfies readonly (keyof PlayerAttributes)[];

interface MetadataRow {
	attr: typeof ATTRIBUTES[number];
	value: string;
}

export default async function getPlayerAttributes(name: string): Promise<PlayerAttributes> {
	const result = await pool.query<MetadataRow>(
		"select attr, value from player_metadata where player = $1 and attr = any($2)",
		[name, ATTRIBUTES]
	);

	const attrs: PlayerAttributes = { name };
	for (const row of result.rows) {
		attrs[row.attr] = row.value;
	}
	return attrs;
}
