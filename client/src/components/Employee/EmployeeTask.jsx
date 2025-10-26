import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import socket from "../../api/socket";
import Loading from "../Loading";

const EmployeeTask = () => {
    const { myTasks = [], fetchMyTasks, updateMyTask } = useAuth();
    const [localTasks, setLocalTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks
    useEffect(() => {
        const loadTasks = async () => {
            await fetchMyTasks();
            setLoading(false);
        };
        loadTasks();
    }, [fetchMyTasks]);

    // Sync with context
    useEffect(() => {
        setLocalTasks(myTasks);
    }, [myTasks]);

    // Real-time updates
    useEffect(() => {
        const handleTaskUpdate = (updatedTask) => {
            setLocalTasks((prev) =>
                prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
        };

        socket.on("taskUpdated", handleTaskUpdate);
        socket.on("taskAssigned", handleTaskUpdate);

        return () => {
            socket.off("taskUpdated", handleTaskUpdate);
            socket.off("taskAssigned", handleTaskUpdate);
        };
    }, []);

    const handleStatusChange = async (taskId, newStatus, oldStatus) => {
        setLocalTasks((prev) =>
            prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );

        try {
            await updateMyTask(taskId, newStatus);

            if (newStatus === "completed") {
                setTimeout(() => {
                    socket.emit("taskUpdatedByEmployee", { taskId, status: "completed" });
                }, 3000);
            }
        } catch (err) {
            setLocalTasks((prev) =>
                prev.map((t) => (t._id === taskId ? { ...t, status: oldStatus } : t))
            );
        }
    };

    const renderButton = (task) => {
        switch (task.status) {
            case "pending":
                return (
                    <button
                        onClick={() =>
                            handleStatusChange(task._id, "in-progress", task.status)
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md"
                    >
                        Start Task
                    </button>
                );
            case "in-progress":
                return (
                    <button
                        onClick={() =>
                            handleStatusChange(task._id, "completed", task.status)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md"
                    >
                        Mark Completed
                    </button>
                );
            case "redo":
                return (
                    <button
                        onClick={() =>
                            handleStatusChange(task._id, "completed", task.status)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md"
                    >
                        Re-Submit
                    </button>
                );
            case "completed":
                return (
                    <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
                        ✅ Completed
                    </span>
                );
            default:
                return <span className="text-gray-500">{task.status}</span>;
        }
    };

    if (loading) return <Loading />;

    if (!localTasks.length) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center">
                <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    No Tasks Yet
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Once your admin assigns you a task, it will appear here.
                </p>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-linear-to-br from-indigo-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-10 text-center">
                    My Assigned Tasks
                </h1>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {localTasks.map((task) => (
                        <div
                            key={task._id}
                            className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 
              rounded-3xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                                    {task.title}
                                </h2>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                    {task.description || "No description provided."}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                        Status:
                                    </span>{" "}
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                        Due Date:
                                    </span>{" "}
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>

                            <div className="mt-5 flex justify-end">{renderButton(task)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EmployeeTask;
