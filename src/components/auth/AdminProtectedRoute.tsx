import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assuming AuthContext is in this path
import { Loader2 } from 'lucide-react'; // For loading spinner

// --- Admin Role Simulation ---
// TODO: Replace this with a proper role management system in production.
// For demonstration purposes, we'll hardcode an admin email.
const ADMIN_EMAIL = "admin@example.com"; 
// Alternatively, you could use a Firebase UID:
// const ADMIN_UID = "YOUR_ADMIN_FIREBASE_UID";
// --- End Admin Role Simulation ---

const AdminProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="ml-4 text-lg">Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    // User not logged in, redirect them to the login page.
    // Pass the current location so we can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the logged-in user is an admin
  const isAdmin = currentUser.email === ADMIN_EMAIL;
  // Or, if using UID:
  // const isAdmin = currentUser.uid === ADMIN_UID;

  if (!isAdmin) {
    // User is logged in but not an admin, redirect to not-authorized page.
    return <Navigate to="/not-authorized" replace />;
  }

  // User is authenticated and is an admin, render the child routes
  return <Outlet />;
};

export default AdminProtectedRoute;
