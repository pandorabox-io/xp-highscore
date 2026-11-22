import express from "express";
import type { NextFunction, Request, Response } from "express";

const app = express();
app.disable("x-powered-by");
app.use(express.static("dist"));
app.disable("etag");

export default app;

// final error handler, must be registered after all routes (see index.ts)
// logs the error server-side and never sends stack traces to the client
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
	console.error(err);
	if (!res.headersSent) {
		res.status(500).end();
	}
}
