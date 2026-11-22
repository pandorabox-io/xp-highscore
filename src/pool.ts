import pg from "pg";

// connection settings are taken from the PG* environment variables
const pool = new pg.Pool();

export default pool;
