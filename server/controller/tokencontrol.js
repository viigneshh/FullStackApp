const GetTokens1=require('../model/tokenmodel');

exports.getTkn=(req,res)=>{
    const projectId=req.params.id;

    GetTokens1.getall(projectId,(err,results)=>{
        if(err){ res.status(500).json({ message: 'Database error', err })};
    
        res.status(200).json(results)}
        );
};