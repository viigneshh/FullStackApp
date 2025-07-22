const db = require('../config/db');

const getTokens = {
  getall: async (id) => {
    const [results] = await db.query('SELECT * FROM tokens WHERE projectid = ?', [id]);
    return results;
  },

  create: async (data) => {
    const { projectid, token_category, token_subcategory, token_value, token_name } = data;
    const [result] = await db.query(
      'INSERT INTO tokens (projectid, token_category, token_subcategory, token_value, token_name) VALUES (?, ?, ?, ?, ?)',
      [projectid, token_category, token_subcategory, token_value, token_name]
    );
    return result;
  },

  getSubcategories: async () => {
    const [results] = await db.query('SELECT subcategory, jsonNested FROM token_export_keywords');
    return results;
  },

  getExportKeywords: async () => {
    const [results] = await db.query('SELECT * FROM token_export_keywords');
    return results;
  },

  deletetkn: async (tokenid) => {
    const [result] = await db.query('DELETE FROM tokens WHERE tokenid = ?', [tokenid]);
    return result;
  }
};

module.exports = getTokens;
