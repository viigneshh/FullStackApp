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
    gap: '8px',
  };

  const rowStyle = {
    display: 'flex',
    gap: '6px',
    fontSize: '15px',
    color: '#111827',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#374151',
    minWidth: '90px',
  };

  return (
    <div style={cardStyle}>
      <div style={rowStyle}>
        <span style={labelStyle}>Name:</span>
        <span>{token.token_name}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Category:</span>
        <span>{token.token_category}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Subcategory:</span>
        <span>{token.token_subcategory}</span>
      </div>
    </div>
  );
}

export default TokenCard;
