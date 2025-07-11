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