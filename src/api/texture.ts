import fs from "node:fs/promises";
import path from "node:path";
import app from "../app.ts";

const CONTENT_TYPES: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpg"
};

// texture filename -> full path
const fileMap = new Map<string, string>();

// recursively index all textures, skipping hidden files and directories
async function walk(dir: string): Promise<void> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name.startsWith(".")) continue;

		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await walk(fullPath);
		} else if (path.extname(entry.name) in CONTENT_TYPES) {
			fileMap.set(entry.name, fullPath);
		}
	}
}

walk("world/worldmods")
	.then(() => console.log(`Indexed ${fileMap.size} textures`))
	.catch(e => console.error(e));

app.get("/api/texture/:name", async (req, res) => {
	const fullPath = fileMap.get(req.params.name);
	if (fullPath === undefined) {
		res.status(404).end();
		return;
	}

	const buffer = await fs.readFile(fullPath);
	res.header("Content-Type", CONTENT_TYPES[path.extname(fullPath)]).send(buffer);
});
