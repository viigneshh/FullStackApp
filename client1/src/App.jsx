// src/App.jsx
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
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
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const { user } = useUser();

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
