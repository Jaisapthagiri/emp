import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import socket from "../../api/socket";
import Loading from "../Loading";

const AdminViewTask = () => {
  const { tasks = [], fetchTasks, updateTaskStatus } = useAuth();
  const [localTasks, setLocalTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchTasks();
      setLoading(false);
    };
    load();
  }, [fetchTasks]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // socket live updates
  useEffect(() => {
    const handleUpdate = (updatedTask) => {
      setLocalTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    };

    const handleAssign = (task) => {
      setLocalTasks((prev) =>
        prev.find((t) => t._id === task._id) ? prev : [task, ...prev]
      );
    };

    socket.on("taskUpdatedByEmployee", handleUpdate);
    socket.on("taskAssigned", handleAssign);

    return () => {
      socket.off("taskUpdatedByEmployee", handleUpdate);
      socket.off("taskAssigned", handleAssign);
    };
  }, []);

  const handleRedo = async (taskId, oldStatus) => {
    setLocalTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: "redo" } : t))
    );

    try {
      await updateTaskStatus(taskId, "redo");
      socket.emit("taskUpdated", { taskId, status: "redo" });
    } catch (err) {
      // revert
      setLocalTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: oldStatus } : t))
      );
    }
  };

  const renderStatusButton = (task) => {
    if (task.status === "completed") {
      return (
        <button
          onClick={() => handleRedo(task._id, task.status)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Redo
        </button>
      );
    } else if (task.status === "redo") {
      return <span className="text-blue-600 font-medium">Waiting for Employee</span>;
    } else {
      return <span className="text-gray-600">{task.status}</span>;
    }
  };

  if (loading) return <Loading />;

  if (!localTasks.length)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-zinc-600 dark:text-zinc-400">No tasks available.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
        Manage Employee Tasks
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-indigo-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Assigned To</th>
              <th className="px-4 py-2 border-b">Due Date</th>
              <th className="px-4 py-2 border-b">Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {localTasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-indigo-50 dark:hover:bg-zinc-700 transition"
              >
                <td className="px-4 py-2 border-b font-semibold text-indigo-600">
                  {task.title}
                </td>
                <td className="px-4 py-2 border-b text-zinc-700 dark:text-zinc-300">
                  {task.description}
                </td>
                <td className="px-4 py-2 border-b">
                  {task.assignedTo?.name || "-"}
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border-b">{renderStatusButton(task)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminViewTask;
