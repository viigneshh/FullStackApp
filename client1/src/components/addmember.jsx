import { useState } from 'react';
import '../css/modal.css';
import axios from 'axios';

function AddMemberModal({ projectId, onClose, onMemberAdded }) {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState(null);

  const handleAdd = async () => {
    if (!userId) return;

    try {
      const res = await axios.post('http://localhost:5000/api/project/add-member', {
        userid: userId,
        projectid: projectId,
        role: 'Editor', // Default or customizable
      });

      setStatus('User added successfully!');
      onMemberAdded(); // Refresh member list
      setTimeout(onClose, 800); // Auto-close modal
    } catch (err) {
      setStatus('Failed to add user');
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Member</h2>
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="btn add-btn" onClick={handleAdd}>Add</button>
        <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
        {status && <p className="status-msg">{status}</p>}
      </div>
    </div>
  );
}

export default AddMemberModal;
