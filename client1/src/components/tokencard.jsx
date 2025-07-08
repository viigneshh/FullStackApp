import '../css/token.css'
function TokenCard({token}){
    
    return(
        <div className="token">
            <div>name:{token.token_category}</div>
            <div>name:{token.token_subcategory}</div>
        </div>
    )
}
export default TokenCard;