import React, { useState } from 'react';
import axios from 'axios';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext'; // ✅ Import context

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Access context setter

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      const { token, userid, username } = res.data;

      // ✅ Store token separately (optional)
      localStorage.setItem('token', token);

      // ✅ Store in context + localStorage via context logic
      setUser({
        token,
        userid,
        username,
      });

      // ✅ Navigate
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
 const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <hr style={{ width: '100%', margin: '20px 0' }} />
      <button onClick={handleGoogleLogin}>Continue with Google</button>

      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

export default LoginPage;
