import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

function GoogleSuccessPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const userid = query.get('userid');
    const username = query.get('username');

    if (token && userid && username) {
      localStorage.setItem('token', token);
      setUser({ token, userid, username });
      navigate('/home');
    } else {
      alert("Login failed or missing credentials");
      navigate('/login');
    }
  }, []);

  return <p>Logging you in with Google...</p>;
}

export default GoogleSuccessPage;
