import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import CreateProject from './pages/createProject';
import ProjectDashboard from './pages/prodashboard';
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useUser } from './context/userContext';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const { user, setUser } = useUser();

  // ✅ Handle Google OAuth callback
 useEffect(() => {
  const isGoogleCallback = location.pathname.startsWith("/auth/google/callback");

  if (isGoogleCallback) {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const username = query.get("username");
    const userid = query.get("userid");

    if (token && username && userid) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userid", userid);

      setUser({ token, username, userid });

      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true }); // fallback
    }
  }
}, [location.pathname]);


  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* This route is handled by useEffect */}
        <Route path="/auth/google/callback" element={<div>Loading...</div>} />

        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/project/create" element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        } />
        
        <Route path="/prodashboard" element={
          <ProtectedRoute>
            <ProjectDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
