const pool = require("../config/db.config");

class Report {
  static async create({ petId, reporterPhone, location }) {
    const result = await pool.query(
      "INSERT INTO reports (pet_id, reporter_phone, location, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [petId, reporterPhone, location]
    );
    return result.rows[0];
  }

  static async findByPetId(petId) {
    const result = await pool.query(
      "SELECT * FROM reports WHERE pet_id = $1 ORDER BY timestamp DESC",
      [petId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM reports WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM reports WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Report;
