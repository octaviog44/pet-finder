const pool = require("../config/db.config");
const bcrypt = require("bcryptjs");

class User {
  static async create({ name, email, password, location }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, location]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async updateLocation(userId, location) {
    const result = await pool.query(
      "UPDATE users SET location = $1 WHERE id = $2 RETURNING *",
      [location, userId]
    );
    return result.rows[0];
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;
