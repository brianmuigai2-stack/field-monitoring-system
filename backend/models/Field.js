const pool = require('../config/database');

class Field {
  static async create(fieldData) {
    const { name, crop_type, planting_date, current_stage, status, assigned_agent_id } = fieldData;
    const query = `
      INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, crop_type, planting_date, current_stage, status, assigned_agent_id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    const query = `
      SELECT f.*, u.username as agent_name 
      FROM fields f 
      LEFT JOIN users u ON f.assigned_agent_id = u.id 
      ORDER BY f.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = `
      SELECT f.*, u.username as agent_name 
      FROM fields f 
      LEFT JOIN users u ON f.assigned_agent_id = u.id 
      WHERE f.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByAgentId(agentId) {
    const query = `
      SELECT f.*, u.username as agent_name 
      FROM fields f 
      LEFT JOIN users u ON f.assigned_agent_id = u.id 
      WHERE f.assigned_agent_id = $1 
      ORDER BY f.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [agentId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    const { name, crop_type, planting_date, current_stage, status, assigned_agent_id } = updateData;
    const query = `
      UPDATE fields 
      SET name = $1, crop_type = $2, planting_date = $3, current_stage = $4, 
          status = $5, assigned_agent_id = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [name, crop_type, planting_date, current_stage, status, assigned_agent_id, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM fields WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_fields,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_fields,
        COUNT(CASE WHEN status = 'at_risk' THEN 1 END) as at_risk_fields,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_fields,
        COUNT(CASE WHEN current_stage = 'planted' THEN 1 END) as planted_fields,
        COUNT(CASE WHEN current_stage = 'growing' THEN 1 END) as growing_fields,
        COUNT(CASE WHEN current_stage = 'ready' THEN 1 END) as ready_fields,
        COUNT(CASE WHEN current_stage = 'harvested' THEN 1 END) as harvested_fields
      FROM fields
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getStatsByAgent(agentId) {
    const query = `
      SELECT 
        COUNT(*) as total_fields,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_fields,
        COUNT(CASE WHEN status = 'at_risk' THEN 1 END) as at_risk_fields,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_fields,
        COUNT(CASE WHEN current_stage = 'planted' THEN 1 END) as planted_fields,
        COUNT(CASE WHEN current_stage = 'growing' THEN 1 END) as growing_fields,
        COUNT(CASE WHEN current_stage = 'ready' THEN 1 END) as ready_fields,
        COUNT(CASE WHEN current_stage = 'harvested' THEN 1 END) as harvested_fields
      FROM fields
      WHERE assigned_agent_id = $1
    `;
    
    try {
      const result = await pool.query(query, [agentId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Field;
