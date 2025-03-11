const pool = require("../config/db.config");

class Pet {
  static async create({ name, status, location, imageUrl, reporterId }) {
    const result = await pool.query(
      "INSERT INTO pets (name, status, location, image_url, reporter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, status, location, imageUrl, reporterId]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM pets WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async findByReporter(reporterId) {
    const result = await pool.query(
      "SELECT * FROM pets WHERE reporter_id = $1 ORDER BY created_at DESC",
      [reporterId]
    );
    return result.rows;
  }

  static async update(id, { name, status, location, imageUrl }) {
    const result = await pool.query(
      "UPDATE pets SET name = $1, status = $2, location = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, status, location, imageUrl, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM pets WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      "UPDATE pets SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    return result.rows[0];
  }
}

module.exports = Pet;
