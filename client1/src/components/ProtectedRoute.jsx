// src/utils/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const [isValid, setIsValid] = useState(null); // null = loading, true/false = decision

  useEffect(() => {
    const verifyToken = async () => {
      if (!user || !user.token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/auth/verify", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (res.status === 200) {
          setIsValid(true); // Token is valid
        } else {
          setIsValid(false);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [user]);

  if (isValid === null) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
