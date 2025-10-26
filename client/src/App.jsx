import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from "./pages/Login";
import Chat from './pages/Chat';

import AdminHome from "./pages/AdminHome";
import AddEmployee from "./components/Admin/AddEmployee";
import AddTask from "./components/Admin/AddTask";
import AdminEmployeeProfile from "./components/Admin/AdminEmployeeProfile";
import AdminViewTask from "./components/Admin/AdminViewTask";

import EmployeeTask from "./components/Employee/EmployeeTask";
import EmployeeProfile from "./components/Employee/EmployeeProfile";

function App() {
  const { user } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div className="min-h-screen from-indigo-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <Navbar />
      <Toaster />
      <main className="px-4 sm:px-6 mt-16 lg:px-8">
        <Routes>

          {/* Default route */}
          <Route
            path="/"
            element={
              user?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Home />
              )
            }
          />

          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          {user?.role === "admin" && (
            <>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/add-task" element={<AddTask />} />
              <Route path="/admin/view-task" element={<AdminViewTask />} />
              <Route path="/admin/view-employee" element={<AdminEmployeeProfile />} />
              <Route path="/admin/add-employee" element={<AddEmployee />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Employee routes */}
          {user?.role === "employee" && (
            <>
              <Route path="/employee/tasks" element={<EmployeeTask />} />
              <Route path="/employee/profile" element={<EmployeeProfile />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Catch-all: redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
