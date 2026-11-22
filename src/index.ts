import app, { errorHandler } from "./app.ts";
import "./api/index.ts";

app.use(errorHandler);

app.listen(8080, () => console.log("Listening on http://127.0.0.1:8080"));
