import pg from "pg";

// connection settings are taken from the PG* environment variables
const pool = new pg.Pool();

// idle clients can error (e.g. database restart), without a listener
// the "error" event would crash the process
pool.on("error", err => console.error(`pg pool error: ${err.message}`));

export default pool;
