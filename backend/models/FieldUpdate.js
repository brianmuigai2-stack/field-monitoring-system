const pool = require('../config/database');

class FieldUpdate {
  static async create(updateData) {
    const { field_id, agent_id, stage, notes } = updateData;
    const query = `
      INSERT INTO field_updates (field_id, agent_id, stage, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [field_id, agent_id, stage, notes];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByFieldId(fieldId) {
    const query = `
      SELECT fu.*, u.username as agent_name 
      FROM field_updates fu 
      JOIN users u ON fu.agent_id = u.id 
      WHERE fu.field_id = $1 
      ORDER BY fu.update_date DESC
    `;
    
    try {
      const result = await pool.query(query, [fieldId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByAgentId(agentId) {
    const query = `
      SELECT fu.*, f.name as field_name 
      FROM field_updates fu 
      JOIN fields f ON fu.field_id = f.id 
      WHERE fu.agent_id = $1 
      ORDER BY fu.update_date DESC
    `;
    
    try {
      const result = await pool.query(query, [agentId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getRecent(limit = 10) {
    const query = `
      SELECT fu.*, u.username as agent_name, f.name as field_name 
      FROM field_updates fu 
      JOIN users u ON fu.agent_id = u.id 
      JOIN fields f ON fu.field_id = f.id 
      ORDER BY fu.update_date DESC 
      LIMIT $1
    `;
    
    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FieldUpdate;
