import { pool } from "./database/conectionPostgreSQL.js";

const getLanguages = async () => {
  try {
    const result = await pool.query(
      "select id, name, developers, enabled FROM language;"
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

getLanguages();
