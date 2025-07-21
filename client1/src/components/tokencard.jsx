function TokenCard({ token }) {
  const cardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  };

  const valueStyle = {
    marginBottom: '8px',
    color: '#111827',
    fontSize: '15px',
  };

  return (
    <div style={cardStyle}>
       <div style={labelStyle}>Name:</div>
      <div style={valueStyle}>{token.token_name}</div>
      <div style={labelStyle}>Category:</div>
      <div style={valueStyle}>{token.token_category}</div>
      <div style={labelStyle}>Subcategory:</div>
      <div style={valueStyle}>{token.token_subcategory}</div>
      
    </div>
  );
}

export default TokenCard;
