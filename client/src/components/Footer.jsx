import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-indigo-900 dark:bg-zinc-900 text-white mt-12">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-400 mb-4">ETMS</h2>
          <p className="text-zinc-300 text-sm">
            Employee Task Management System helps admins manage employees, assign tasks, and track progress in real-time. Built with React, Node.js, and MongoDB.
          </p>
          <div className="flex mt-4 space-x-3">
            <a href="#" className="hover:text-indigo-300"><FaFacebookF /></a>
            <a href="#" className="hover:text-indigo-300"><FaTwitter /></a>
            <a href="#" className="hover:text-indigo-300"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-indigo-300"><FaGithub /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-zinc-300 text-sm">
            <li><Link to="/" className="hover:text-indigo-300">Home</Link></li>
            <li><Link to="/employee/tasks" className="hover:text-indigo-300">My Tasks</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-indigo-300">Dashboard</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-300">Contact Us</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-zinc-300 text-sm">
            <li><Link to="/docs" className="hover:text-indigo-300">Documentation</Link></li>
            <li><Link to="/faq" className="hover:text-indigo-300">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-indigo-300">Support</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-300">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-zinc-300 text-sm mb-2">123 ETMS Street, Tech City, India</p>
          <p className="text-zinc-300 text-sm mb-2">Email: support@etms.com</p>
          <p className="text-zinc-300 text-sm">Phone: +91 9876543210</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-indigo-800 dark:bg-zinc-950 text-zinc-300 text-center py-4 text-sm">
        © {new Date().getFullYear()} Employee Task Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
