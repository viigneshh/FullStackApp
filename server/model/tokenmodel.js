const db=require('../config/db')

const getTokens={
    getall:(id,callback)=>{
        db.query('SELECT * FROM tokens WHERE projectid=?',[id],callback);
    },
    create:(data,callback)=>{
        const{projectid, token_category, token_subcategory, token_value}=data;
        db.query('insert INTO tokens (projectid, token_category, token_subcategory, token_value) values (?,?,?,?)',
            [projectid, token_category, token_subcategory, token_value],callback)
    }
};

module.exports=getTokens;

