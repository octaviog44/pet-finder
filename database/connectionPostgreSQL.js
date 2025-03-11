import pg from "pg";

export const pool = new pg.Pool({
  host: "localhost",
  port: 8080,
  database: "pet-finder",
  user: "postgres",
  password: "octavio",
});
