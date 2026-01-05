import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Redirect based on role
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a nice spinner
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/'} />} />

      {/* Protected Routes for regular users */}
      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/" element={<UserDashboard user={user} onLogout={handleLogout} />} />
      </Route>

      {/* Protected Routes for admins */}
      <Route element={<ProtectedRoute user={user} allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
      </Route>

      {/* Catch all - redirect to home (which will redirect to login if not auth) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
