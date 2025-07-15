// src/components/CreateTokenModal.jsx
import '../css/createtoken.css';
import React, { useState } from 'react';
import axios from 'axios';
import { SUBCATEGORIES } from './subcats';

export default function CreateTokenModal({ projectId, onClose }) {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [value, setValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = Object.keys(SUBCATEGORIES);
  const filteredSubs = (SUBCATEGORIES[category] || []).filter(sub =>
    sub.toLowerCase().includes(subcategory.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!category || !subcategory || !value) return alert('Please fill all fields');
    try {
      await axios.post('http://localhost:5000/api/token', {
        projectid: projectId,
        token_category: category,
        token_subcategory: subcategory,
        token_value: value
      });
      alert('Token created');
      onClose();
    } catch (err) {
      alert('Error creating token');
    }
  };

  const handleSelectSub = (val) => {
    setSubcategory(val);
    setShowDropdown(false);
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <h2 className="modalTitle">Create Token</h2>

        <select value={category} onChange={e => setCategory(e.target.value)} className="dropdownInput">
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {category && (
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Enter or search subcategory"
              value={subcategory}
              onChange={e => {
                setSubcategory(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && filteredSubs.length > 0 && (
              <ul className="autocomplete-list">
                {filteredSubs.map((sub, i) => (
                  <li key={i} onClick={() => handleSelectSub(sub)}>
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <input
          type="text"
          className="inputBox"
          placeholder="Token Value (e.g. #fff, 12px, 1rem)"
          value={value}
          onChange={e => setValue(e.target.value)}
        />

        <div className="btnRow">
          <button className="cancelBtn" onClick={onClose}>Cancel</button>
          <button className="submitBtn" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
}
