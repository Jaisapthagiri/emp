import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { LogOut, Bell, MessageCircle } from "lucide-react";

const Navbar = () => {
  const { user, logout, hasNewTasks, fetchMyTasks } = useAuth();
  const { unseenMessages } = useChat(); // <-- get real-time unseen messages
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTasksClick = async () => {
    if (user?.role === "employee") {
      await fetchMyTasks();
      navigate("/employee/tasks");
    }
  };

  // count total unseen messages
  const totalUnseen = Object.values(unseenMessages).reduce((a, b) => a + b, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight"
        >
          Employee Task Manager
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Employee Navigation */}
          {user?.role === "employee" && (
            <>
              <Link
                to="/"
                className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition"
              >
                Home
              </Link>
              <Link
                to="/employee/profile"
                className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition"
              >
                Profile
              </Link>

              <button
                onClick={handleTasksClick}
                className="relative text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition"
              >
                <Bell className="w-5 h-5 inline-block mr-1" />
                Tasks
                {hasNewTasks && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Chat Link */}
              <Link
                to="/chat"
                className="relative text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition flex items-center gap-1"
              >
                <MessageCircle className="w-5 h-5" />
                Chat
                {totalUnseen > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin"
                className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/add-task"
                className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition"
              >
                Add Task
              </Link>
              <Link
                to="/admin/view-employee"
                className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition"
              >
                Employees
              </Link>

              {/* Chat Link */}
              <Link
                to="/chat"
                className="relative text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition flex items-center gap-1"
              >
                <MessageCircle className="w-5 h-5" />
                Chat
                {totalUnseen > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </Link>
            </>
          )}

          {/* Auth Control */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm sm:text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
