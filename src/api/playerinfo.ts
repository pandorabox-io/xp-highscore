import type { Request, Response } from "express";
import app from "../app.ts";
import pool from "../pool.ts";
import getPlayerAttributes from "../util/getplayerattributes.ts";
import type { PlayerInfo } from "#shared/types.ts";

interface PlayerRow {
	name: string;
	creation_date: Date;
	modification_date: Date;
}

app.get("/api/playerinfo", async (req: Request, res: Response<PlayerInfo>) => {
	const name = req.query.name;
	if (typeof name !== "string" || name === "") {
		res.status(200).end();
		return;
	}

	const result = await pool.query<PlayerRow>(
		"select p.name, p.modification_date, p.creation_date from player p where p.name = $1::text",
		[name]
	);

	const row = result.rows[0];
	if (!row) {
		res.status(404).end();
		return;
	}

	res.json({
		name: row.name,
		created: row.creation_date.toISOString(),
		modified: row.modification_date.toISOString(),
		attributes: await getPlayerAttributes(row.name)
	});
});
