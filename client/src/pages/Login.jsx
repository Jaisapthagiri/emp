import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth(); // Combined login function for both roles
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password, formData.role);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center bg-white dark:bg-zinc-900 border border-zinc-300/40 dark:border-zinc-700 rounded-3xl px-10 py-8 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]"
      >
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Welcome Back
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          Sign in to access your account
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-lg transition-all"
        >
          Login
        </button>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-6">
          Login with your Admin or Employee credentials.
        </p>
      </form>
    </div>
  );
};

export default Login;
