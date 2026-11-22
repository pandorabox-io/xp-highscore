import fs from "node:fs/promises";
import type { Request, Response } from "express";
import app from "../app.ts";
import type { SkinsDB } from "#shared/types.ts";

app.get("/api/skinsdb", async (_req: Request, res: Response<SkinsDB>) => {
	const skinsdb: SkinsDB = JSON.parse(await fs.readFile("world/mod_storage/skinsdb", "utf-8"));
	res.json(skinsdb);
});
