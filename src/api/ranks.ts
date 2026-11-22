import fs from "node:fs";
import type { Request, Response } from "express";
import app from "../app.ts";
import type { Rank } from "#shared/types.ts";

const ranks: Rank[] = JSON.parse(fs.readFileSync("world/ranks.json", "utf-8"));

app.get("/api/ranks", (_req: Request, res: Response<Rank[]>) => {
	res.json(ranks);
});
