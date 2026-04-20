const pool = require('../config/database');

class User {
  static async create(userData) {
    const { username, email, password_hash, role } = userData;
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const values = [username, email, password_hash, role];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    
    try {
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAgents() {
    const query = 'SELECT id, username, email FROM users WHERE role = $1';
    
    try {
      const result = await pool.query(query, ['field_agent']);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
