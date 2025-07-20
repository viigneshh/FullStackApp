const db = require('../config/db');

const getTokens = {
  getall: (id, callback) => {
    db.query('SELECT * FROM tokens WHERE projectid = ?', [id], callback);
  },

  create: (data, callback) => {
    const { projectid, token_category, token_subcategory, token_value } = data;
    db.query(
      'INSERT INTO tokens (projectid, token_category, token_subcategory, token_value) VALUES (?, ?, ?, ?)',
      [projectid, token_category, token_subcategory, token_value],
      callback
    );
  },

  getSubcategories: (callback) => {
    const query = 'SELECT subcategory, jsonNested FROM token_export_keywords';
    db.query(query, callback);
  },

  getExportKeywords: (callback) => {
    const query = 'SELECT * FROM token_export_keywords';
    db.query(query, callback);
  },

 
  deletetkn: (tokenid, callback) => {
    const query = 'DELETE FROM tokens WHERE tokenid = ?';
    db.query(query, [tokenid], callback);
  }
};

module.exports = getTokens;
