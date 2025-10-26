import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AddTask = () => {
  const navigate = useNavigate();
  const { employees, fetchTasks } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employeeId: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const { data } = await api.post("/admin/task/assign", formData);
      toast.success(data.message || "Task assigned successfully!");

      setFormData({
        title: "",
        description: "",
        employeeId: "",
        dueDate: "",
      });

      await fetchTasks();
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-16 px-6">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-xl p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Assign a New Task
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Fill out the details below to assign a task to your team member.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the task clearly..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Employee Selector */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Assign To
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl
            bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="">Select Employee</option>
              {employees?.length > 0 ? (
                employees.map((emp) => {
                  const pending = emp.tasks?.filter((t) => t.status === "pending").length || 0;
                  const inProgress =
                    emp.tasks?.filter((t) => t.status === "in-progress").length || 0;
                  const summary = [];
                  if (pending) summary.push(`🕒 Pending: ${pending}`);
                  if (inProgress) summary.push(`🚧 In Progress: ${inProgress}`);

                  return (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} {summary.length ? `(${summary.join(", ")})` : ""}
                    </option>
                  );
                })
              ) : (
                <option disabled>No employees available</option>
              )}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
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
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 text-zinc-600 dark:text-zinc-300 hover:text-indigo-500
            font-semibold rounded-full border border-zinc-300 dark:border-zinc-600
            hover:border-indigo-500 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold
            rounded-full shadow-lg transition transform hover:scale-[1.02]"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </section>
  );

};

export default AddTask;
