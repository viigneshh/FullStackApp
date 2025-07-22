const GetTokens1 = require('../model/tokenmodel');

exports.getTkn = async (req, res) => {
  try {
    const results = await GetTokens1.getall(req.params.id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Database error', err });
  }
};

exports.createTkn = async (req, res) => {
  try {
    const { projectid, token_category, token_subcategory, token_value } = req.body;
    if (!projectid || !token_category || !token_subcategory || !token_value) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await GetTokens1.create(req.body);
    res.status(201).json({ message: 'Token created', tokenId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'DB Insert Error', err });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    const results = await GetTokens1.getSubcategories();
    const mapped = results.map(row => {
      const parts = row.jsonNested?.split('.') || [];
      return {
        subcategory: row.subcategory,
        category: parts.length > 1 ? parts[0] : 'unknown'
      };
    });
    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories', details: err });
  }
};

exports.getExportKeywords = async (req, res) => {
  try {
    const results = await GetTokens1.getExportKeywords();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load export keywords', details: err });
  }
};

exports.DeleteTokens = async (req, res) => {
  try {
    await GetTokens1.deletetkn(req.params.tid);
    res.status(200).json({ message: 'Token deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Db error', err });
  }
};
