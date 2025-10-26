import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import socket from "../api/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // -------------------------
    // USER AUTH STATE
    // -------------------------
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    const login = async (email, password, role) => {
        try {
            const endpoint = role === "admin" ? "/admin/login" : "/employee/login";
            const res = await api.post(endpoint, { email, password });
            const userData = {
                ...(res.data.user || res.data.admin),
                role,
                _id: res.data.user?._id || res.data.admin?._id,
            };
            setUser(userData);
            localStorage.setItem("token", res.data.token);
            toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
            return userData;
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
    };

    // -------------------------
    // TASK STATE
    // -------------------------
    const [tasks, setTasks] = useState([]); // Admin view tasks
    const [myTasks, setMyTasks] = useState([]); // Employee tasks
    const [hasNewTasks, setHasNewTasks] = useState(false);

    // Admin fetch all tasks
    const fetchTasks = async () => {
        if (user?.role !== "admin") return;
        try {
            const { data } = await api.get("/admin/view-task");
            setTasks(data.tasks || []);
        } catch (err) {
            toast.error("Failed to fetch tasks");
        }
    };

    // Employee fetch tasks
    const fetchMyTasks = async () => {
        if (user?.role !== "employee") return;
        try {
            const token = localStorage.getItem("token");
            const { data } = await api.get("/employee/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyTasks(prev => {
                return data.map(task => {
                    const existing = prev.find(t => t._id === task._id);
                    return existing ? { ...task, hasUpdate: existing.hasUpdate || false } : { ...task, hasUpdate: true };
                });
            });
        } catch (err) {
            toast.error("Failed to fetch your tasks");
        }
    };

    // Update task status (admin or employee)
    const updateTaskStatus = async (taskId, status) => {
        try {
            const token = localStorage.getItem("token");
            const endpoint = user.role === "admin"
                ? `/admin/task/${taskId}/status`
                : `/employee/tasks/${taskId}`;

            const { data } = await api.patch(endpoint, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (user.role === "admin") {
                setTasks(prev => prev.map(t => t._id === taskId ? data.task : t));
                // Notify employee
                socket.emit("taskUpdated", data.task);
            } else {
                setMyTasks(prev => prev.map(t => t._id === taskId ? data.task : t));
                // Notify admin
                socket.emit("taskUpdatedByEmployee", data.task);
            }

            toast.success("Task updated!");
            return data.task;
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error("Failed to update task status");
            throw err;
        }
    };

    // Update task (used in EmployeeTask)
    const updateMyTask = async (taskId, newStatus) => {
        return updateTaskStatus(taskId, newStatus);
    };

    // Listen for real-time updates from admin (for employees)
    useEffect(() => {
        if (user?.role === "employee") {
            const handleTaskUpdate = updatedTask => {
                setMyTasks(prev => {
                    const exists = prev.find(t => t._id === updatedTask._id);
                    if (exists) {
                        return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
                    } else {
                        return [updatedTask, ...prev];
                    }
                });
            };
            socket.on("taskUpdated", handleTaskUpdate);
            socket.on("taskAssigned", handleTaskUpdate);

            return () => {
                socket.off("taskUpdated", handleTaskUpdate);
                socket.off("taskAssigned", handleTaskUpdate);
            };
        }
    }, [user]);

    // Listen for employee updates (for admin)
    useEffect(() => {
        if (user?.role === "admin") {
            const handleEmployeeUpdate = updatedTask => {
                setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
            };
            socket.on("taskUpdatedByEmployee", handleEmployeeUpdate);

            return () => {
                socket.off("taskUpdatedByEmployee", handleEmployeeUpdate);
            };
        }
    }, [user]);

    // -------------------------
    // EMPLOYEE MANAGEMENT (ADMIN ONLY)
    // -------------------------
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const fetchEmployees = async () => {
        if (user?.role !== "admin") return;
        try {
            const { data } = await api.get("/admin/employee");
            setEmployees(data.employees || []);
        } catch (err) {
            toast.error("Failed to fetch employees");
        }
    };

    const selectEmployee = async (employeeId) => {
        setLoadingEmployees(true);
        try {
            const { data } = await api.get(`/admin/employee/${employeeId}`);
            setSelectedEmployee(data);
        } catch (err) {
            toast.error("Failed to fetch employee details");
        } finally {
            setLoadingEmployees(false);
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            const { data } = await api.delete(`/admin/employee/${employeeId}`);
            toast.success(data.message || "Employee deleted");
            setSelectedEmployee(null);
            fetchEmployees();
        } catch (err) {
            toast.error("Failed to delete employee");
        }
    };

    

    return (
        <AuthContext.Provider
            value={{
                user, login, logout,
                tasks, myTasks, hasNewTasks, fetchTasks, fetchMyTasks, updateTaskStatus, updateMyTask,
                employees, selectedEmployee, fetchEmployees, selectEmployee, deleteEmployee, loadingEmployees,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

