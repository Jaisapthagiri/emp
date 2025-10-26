import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Loading from "../Loading";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle field changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/employee/create", formData, {
        withCredentials: true,
      });

      toast.success(res.data?.message || "Employee added successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        position: "",
        department: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-16 px-6">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-xl p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Add New Employee
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Enter the employee details to add them to the organization.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Set a secure password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Position
            </label>
            <input
              type="text"
              name="position"
              placeholder="e.g. Software Engineer"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              placeholder="e.g. HR, IT, Marketing"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 text-zinc-600 dark:text-zinc-300 hover:text-indigo-500
            font-semibold rounded-full border border-zinc-300 dark:border-zinc-600
            hover:border-indigo-500 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-full font-semibold text-white shadow-lg transition transform hover:scale-[1.02] ${loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
                }`}
            >
              {loading ? <Loading /> : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );

};

export default AddEmployee;
