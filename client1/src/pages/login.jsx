import React, { useState } from 'react';
import axios from 'axios';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    console.log('Came here:',email, password);
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });
      console.log('Login response:', res.data);

      const { token, userid, username } = res.data;
      localStorage.setItem('token', token);
      setUser({ token, userid, username });
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // 👇 New: Redirect to backend's /auth/google
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

      {/* Divider */}
      <hr style={{ width: '100%', margin: '20px 0' }} />
      <button onClick={handleGoogleLogin}>Continue with Google</button>

      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

export default LoginPage;
