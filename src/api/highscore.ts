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

// metadata attribute to join and column to order by, per sort column
const SORT: Record<SortColumn, { attr: string; orderColumn: string }> = {
	xp: { attr: "xp", orderColumn: "md.value::real" },
	digged_nodes: { attr: "digged_nodes", orderColumn: "md.value::real" },
	crafted: { attr: "crafted", orderColumn: "md.value::real" },
	placed_nodes: { attr: "placed_nodes", orderColumn: "md.value::real" },
	died: { attr: "died", orderColumn: "md.value::real" },
	punch_count: { attr: "punch_count", orderColumn: "md.value::real" },
	inflicted_damage: { attr: "inflicted_damage", orderColumn: "md.value::real" },
	played_time: { attr: "played_time", orderColumn: "md.value::real" },
	online: { attr: "xp", orderColumn: "p.modification_date" },
	joined: { attr: "xp", orderColumn: "p.creation_date" }
};

app.get("/api/highscore", async (req: Request, res: Response<HighscoreEntry[]>) => {
	const offset = Math.max(parseInt(String(req.query.start)) || 0, 0);
	const sortOrder: SortOrder = req.query.order === "asc" ? "asc" : "desc";
	const sort = SORT[isSortColumn(req.query.sort) ? req.query.sort : "xp"];

	// orderColumn and sortOrder come from the whitelist above, offset is a number
	const query = `select p.name, p.modification_date, p.creation_date from player p
		join player_metadata md on p.name = md.player
		where md.attr = $1
		and p.modification_date > (NOW() - interval '1 month')
		order by ${sort.orderColumn} ${sortOrder} limit 10 offset ${offset}`;

	const result = await pool.query<PlayerRow>(query, [sort.attr]);

	const score = await Promise.all(result.rows.map(async (row): Promise<HighscoreEntry> => ({
		name: row.name,
		created: row.creation_date.toISOString(),
		modified: row.modification_date.toISOString(),
		attributes: await getPlayerAttributes(row.name)
	})));

	res.json(score);
});
