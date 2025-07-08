const db=require('../config/db')

const getTokens={
    getall:(id,callback)=>{
        db.query('SELECT * FROM tokens WHERE projectid=?',[id],callback);
    }
};
module.exports=getTokens;

