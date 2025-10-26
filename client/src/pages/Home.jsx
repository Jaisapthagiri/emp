import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen dark:bg-zinc-900">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center bg-linear-to-r from-amber-300 to-amber-400 py-24 px-6">
        <img
          src="https://cdn.dribbble.com/userupload/8747135/file/original-2957778e2c144f9fa227e7ebc5a327b5.png?compress=1&resize=1200x900"
          alt="Team collaboration illustration"
          className="w-64 sm:w-80 mb-8"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Employee Task Management System
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl text-lg mb-8">
          Manage employees, assign tasks, track progress, and chat in real-time — all in one platform.
        </p>
        <Link
          to="/employee/tasks"
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold shadow-lg transition"
        >
          Get Started
        </Link>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-12">
          Key Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Employee Management */}
          <div className="bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl shadow-lg p-8 hover:scale-105 transition transform">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3068/3068495.png"
              alt="Employee icon"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
            <p>Admins can create, view, and manage employees securely with role-based access.</p>
          </div>

          {/* Task Assignment */}
          <div className="bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-3xl shadow-lg p-8 hover:scale-105 transition transform">
            <img
              src="https://cdn-icons-png.flaticon.com/512/189/189715.png"
              alt="Task icon"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Task Assignment & Tracking</h3>
            <p>Assign tasks to employees and monitor progress in real-time with status updates like pending, in-progress, redo, and completed.</p>
          </div>

          {/* Real-Time Chat */}
          <div className="bg-linear-to-br from-purple-500 to-pink-500 text-white rounded-3xl shadow-lg p-8 hover:scale-105 transition transform">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6213/6213731.png"
              alt="Chat icon"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
            <p>Employees can chat with admins, and messages are instantly updated via Socket.IO.</p>
          </div>

          {/* Analytics */}
          <div className="bg-linear-to-br from-green-500 to-teal-500 text-white rounded-3xl shadow-lg p-8 hover:scale-105 transition transform">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828906.png"
              alt="Analytics icon"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p>Track task completion rates, monitor employee performance, and visualize productivity trends.</p>
          </div>
        </div>
      </section>

      {/* Role-Based Dashboard */}
      <section className="py-24 px-6 bg-linear-to-r from-indigo-100 to-blue-100 dark:from-zinc-800 dark:to-zinc-700">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <img
            src="https://iconscout.com/illustration/admin-panel-4439228_3728455"
            alt="Dashboard Illustration"
            className="w-full lg:w-1/2 rounded-3xl shadow-lg"
          />
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              Role-Specific Dashboards
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4">
              Admins and employees have personalized dashboards to manage tasks, track messages, and view analytics efficiently.
            </p>
            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-300 space-y-2">
              <li>Admins: Manage employees, assign tasks, track progress, view reports.</li>
              <li>Employees: View assigned tasks, update status, chat with admin in real-time.</li>
              <li>Analytics: Visualize team productivity and task completion trends.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-indigo-600 dark:bg-indigo-700 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to streamline your workflow?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Sign in and start managing your employees and tasks efficiently today.
        </p>
        <Link
          to="/employee/tasks"
          className="px-10 py-4 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;