import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const AdminHome = () => {
    const { employees = [], tasks = [], fetchEmployees, fetchTasks } = useAuth();

    // Calculate pending tasks
    const pendingTasks = tasks.filter(task => task.status !== "completed");

    // Fetch employees and tasks when component mounts
    useEffect(() => {
        fetchEmployees();
        fetchTasks();
    }, [fetchEmployees, fetchTasks]);

    return (
        <div className="min-h-screen dark:bg-zinc-900">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center bg-indigo-100 dark:bg-zinc-800 py-20 px-6">
                <img
                    src="https://cdn.dribbble.com/userupload/4166803/file/original-0d472eae0d8eb7d6d6e0b314d4e6e7d1.png?compress=1&resize=1200x900"
                    alt="Admin dashboard illustration"
                    className="w-64 sm:w-80 mb-8 rounded-xl shadow-lg"
                />
                <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    Admin Dashboard
                </h1>
                <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl text-lg mb-6">
                    Manage employees, assign tasks, track progress, and monitor overall workflow from one place.
                </p>
                <Link
                    to="/admin/view-task"
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-md transition"
                >
                    View All Tasks
                </Link>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <h2 className="text-3xl font-semibold text-center text-indigo-600 dark:text-indigo-400 mb-10">
                    Key Admin Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Add Employee */}
                    <Link
                        to="/admin/add-employee"
                        className="bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg p-8 hover:scale-[1.02] transition flex flex-col items-center"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3068/3068495.png"
                            alt="Employee icon"
                            className="w-16 mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2 text-center">Add Employee</h3>
                        <p className="text-center">
                            Quickly add new employees to the system and manage their details efficiently.
                        </p>
                    </Link>

                    {/* View Tasks */}
                    <Link
                        to="/admin/view-task"
                        className="bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-8 hover:scale-[1.02] transition flex flex-col items-center"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/189/189715.png"
                            alt="Task icon"
                            className="w-16 mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2 text-center">View & Manage Tasks</h3>
                        <p className="text-center">
                            Track progress of all tasks, update statuses, and monitor employee performance in real-time.
                        </p>
                    </Link>

                    {/* Employee Overview */}
                    <Link
                        to="/admin/view-employee"
                        className="bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-8 hover:scale-[1.02] transition flex flex-col items-center"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                            alt="Overview icon"
                            className="w-16 mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2 text-center">Employee Overview</h3>
                        <p className="text-center">
                            Get a quick summary of all employees, their assigned tasks, and their completion stats.
                        </p>
                    </Link>
                </div>
            </section>

            {/* Quick Stats Section */}
            <section className="py-16 px-6 bg-indigo-50 dark:bg-zinc-700">
                <h2 className="text-3xl font-semibold text-center text-indigo-600 dark:text-indigo-400 mb-10">
                    Admin Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-indigo-600 mb-2">{employees.length}</h3>
                        <p className="text-zinc-700 dark:text-zinc-300">Employees</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-indigo-600 mb-2">{tasks.length}</h3>
                        <p className="text-zinc-700 dark:text-zinc-300">Tasks</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-indigo-600 mb-2">{pendingTasks.length}</h3>
                        <p className="text-zinc-700 dark:text-zinc-300">Pending Tasks</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AdminHome;
