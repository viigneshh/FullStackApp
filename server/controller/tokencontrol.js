const GetTokens1=require('../model/tokenmodel');

exports.getTkn=(req,res)=>{
    const projectId=req.params.id;

    GetTokens1.getall(projectId,(err,results)=>{
        if(err){ res.status(500).json({ message: 'Database error', err })};
    
        res.status(200).json(results)}
        );
};

exports.createTkn=(req,res)=>{
    const { projectid, token_category, token_subcategory, token_value } = req.body;
    if (!projectid || !token_category || !token_subcategory || !token_value) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    GetTokens1.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ message: 'DB Insert Error', err });
        res.status(201).json({ message: 'Token created', tokenId: result.insertId });
    });
};

exports.getSubcategories = (req, res) => {
  GetTokens1.getSubcategories((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch subcategories', details: err });
    }

    // Map format to include category
    const mapped = results.map(row => {
      const parts = row.json.split('.');
      return {
        subcategory: row.subcategory,
        category: parts.length > 1 ? parts[0] : 'unknown'
      };
    });

    res.status(200).json(mapped);
  });
};


exports.getExportKeywords = (req, res) => {
  GetTokens1.getExportKeywords((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load export keywords', details: err });
    }
    res.status(200).json(results);
  });
};

exports.DeleteTokens=(req,res)=>{
   const tokenid=req.params.tid;
   GetTokens1.deletetkn(tokenid,(err,results)=>{
    if(err){return res.status(500).json({message:'Db error'})};
    return res.status(200).json({message:'Token deleted successfully'} )
   });

};