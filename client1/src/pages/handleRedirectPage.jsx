import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const userid = queryParams.get('userid');
    const username = queryParams.get('username');

    if (token && userid && username) {
      localStorage.setItem('token', token);
      setUser({ token, userid, username });
      navigate('/home');
    } else {
      alert('Google login failed');
      navigate('/login');
    }
  }, [navigate, setUser]);

  return <p>Logging you in with Google...</p>;
}

export default GoogleRedirectHandler;
