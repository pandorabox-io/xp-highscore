import type { Request, Response } from "express";
import app from "../app.ts";
import pool from "../pool.ts";
import getPlayerAttributes from "../util/getplayerattributes.ts";
import { isSortColumn } from "#shared/types.ts";
import type { HighscoreEntry, SortColumn, SortOrder } from "#shared/types.ts";

interface PlayerRow {
	name: string;
	creation_date: Date;
	modification_date: Date;
}

// metadata values are free text: only cast values that look like numbers,
// anything else (empty, NULL, garbage) becomes NULL instead of failing the query
const NUMERIC_VALUE = String.raw`case when md.value ~ '^\s*-?[0-9]{1,30}(\.[0-9]+)?([eE][-+]?[0-9]{1,2})?\s*$' then md.value::double precision end`;

// metadata attribute to join and column to order by, per sort column
const SORT: Record<SortColumn, { attr: string; orderColumn: string }> = {
	xp: { attr: "xp", orderColumn: NUMERIC_VALUE },
	digged_nodes: { attr: "digged_nodes", orderColumn: NUMERIC_VALUE },
	crafted: { attr: "crafted", orderColumn: NUMERIC_VALUE },
	placed_nodes: { attr: "placed_nodes", orderColumn: NUMERIC_VALUE },
	died: { attr: "died", orderColumn: NUMERIC_VALUE },
	punch_count: { attr: "punch_count", orderColumn: NUMERIC_VALUE },
	inflicted_damage: { attr: "inflicted_damage", orderColumn: NUMERIC_VALUE },
	played_time: { attr: "played_time", orderColumn: NUMERIC_VALUE },
	online: { attr: "xp", orderColumn: "p.modification_date" },
	joined: { attr: "xp", orderColumn: "p.creation_date" }
};

// upper bound for the paging offset, avoids huge offsets and full table scans
const MAX_OFFSET = 10000;

app.get("/api/highscore", async (req: Request, res: Response<HighscoreEntry[]>) => {
	const offset = Math.min(Math.max(parseInt(String(req.query.start)) || 0, 0), MAX_OFFSET);
	const sortOrder: SortOrder = req.query.order === "asc" ? "asc" : "desc";
	const sort = SORT[isSortColumn(req.query.sort) ? req.query.sort : "xp"];

	// orderColumn and sortOrder come from the whitelist above
	// nulls last: postgres sorts NULLs first on desc by default
	// p.name: stable tie-breaker so paging doesn't skip or repeat players
	const query = `select p.name, p.modification_date, p.creation_date from player p
		join player_metadata md on p.name = md.player
		where md.attr = $1
		and p.modification_date > (NOW() - interval '1 month')
		order by ${sort.orderColumn} ${sortOrder} nulls last, p.name limit 10 offset $2`;

	const result = await pool.query<PlayerRow>(query, [sort.attr, offset]);

	const score = await Promise.all(result.rows.map(async (row): Promise<HighscoreEntry> => ({
		name: row.name,
		created: row.creation_date.toISOString(),
		modified: row.modification_date.toISOString(),
		attributes: await getPlayerAttributes(row.name)
	})));

	res.json(score);
});
