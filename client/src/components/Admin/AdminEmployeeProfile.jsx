import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";

const AdminEmployeeProfile = () => {
  const {
    employees,
    selectedEmployee,
    loadingEmployees,
    fetchEmployees,
    selectEmployee,
    deleteEmployee,
  } = useAuth();

  const [search, setSearch] = useState("");
  const [visibleEmployees, setVisibleEmployees] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (search === "" && showList) {
      setVisibleEmployees(employees.slice(0, 5));
    } else {
      const filtered = employees.filter((emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase())
      );
      setVisibleEmployees(filtered);
    }
  }, [search, employees, showList]);

  const handleBlur = () => {
    setTimeout(() => setShowList(false), 150);
  };

  const getTasksByStatus = (status) => {
    if (!selectedEmployee?.tasks) return [];
    return selectedEmployee.tasks.filter((t) => t.status === status);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">
        Employee Profile Management
      </h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search employee by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowList(true)}
          onBlur={handleBlur}
          className="w-full px-4 py-3 border border-zinc-300 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            dark:bg-zinc-800 dark:text-white transition"
        />

        {showList && visibleEmployees.length > 0 && (
          <ul
            className="absolute bg-white dark:bg-zinc-900 w-full border 
              border-zinc-300 dark:border-zinc-700 mt-1 max-h-60 overflow-y-auto 
              rounded-lg z-50 shadow-md"
          >
            {visibleEmployees.map((emp) => {
              const pending =
                emp.tasks?.filter((t) => t.status === "pending").length || 0;
              const inProgress =
                emp.tasks?.filter((t) => t.status === "in-progress").length || 0;
              const redo =
                emp.tasks?.filter((t) => t.status === "redo").length || 0;
              const completed =
                emp.tasks?.filter((t) => t.status === "completed").length || 0;

              const summary = [];
              if (pending) summary.push(`Pending: ${pending}`);
              if (inProgress) summary.push(`In Progress: ${inProgress}`);
              if (redo) summary.push(`Redo: ${redo}`);
              if (completed) summary.push(`Completed: ${completed}`);

              return (
                <li
                  key={emp._id}
                  onMouseDown={() => {
                    selectEmployee(emp._id);
                    setSearch("");
                    setShowList(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50 
                    dark:hover:bg-zinc-700 transition"
                >
                  {emp.name}{" "}
                  {summary.length ? (
                    <span className="text-sm text-zinc-500 ml-2">
                      ({summary.join(", ")})
                    </span>
                  ) : (
                    ""
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Loading State */}
      {loadingEmployees && (
        <div className="flex justify-center py-10">
          <Loading />
        </div>
      )}

      {/* Selected Employee Details */}
      {selectedEmployee && !loadingEmployees && (
        <div className="space-y-10">
          {/* Profile Card */}
          <div className="p-6 border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-md relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Name:
                </strong>{" "}
                {selectedEmployee.name}
              </p>
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Email:
                </strong>{" "}
                {selectedEmployee.email}
              </p>
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Role:
                </strong>{" "}
                {selectedEmployee.role}
              </p>
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Position:
                </strong>{" "}
                {selectedEmployee.position || "-"}
              </p>
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Department:
                </strong>{" "}
                {selectedEmployee.department || "-"}
              </p>
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Date of Joining:
                </strong>{" "}
                {selectedEmployee.dateOfJoining
                  ? new Date(selectedEmployee.dateOfJoining).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Status:
                </strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedEmployee.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedEmployee.status}
                </span>
              </p>
            </div>

            <button
              onClick={() => deleteEmployee(selectedEmployee._id)}
              className="absolute top-5 right-5 bg-red-600 hover:bg-red-500 
                text-white px-4 py-2 rounded-lg shadow transition"
            >
              Delete Employee
            </button>
          </div>

          {/* Task Sections */}
          {["pending", "in-progress", "redo", "completed"].map((status) => (
            <div key={status}>
              <h2
                className={`text-2xl font-semibold mb-4 capitalize ${
                  status === "completed"
                    ? "text-green-600"
                    : status === "in-progress"
                    ? "text-blue-600"
                    : status === "redo"
                    ? "text-orange-600"
                    : "text-indigo-600"
                }`}
              >
                {status.replace("-", " ")} Tasks
              </h2>

              {getTasksByStatus(status).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTasksByStatus(status).map((task) => (
                    <div
                      key={task._id}
                      className="p-4 border rounded-lg dark:border-zinc-700 
                        dark:bg-zinc-800 bg-white shadow-sm"
                    >
                      <p className="font-semibold text-indigo-600">
                        {task.title}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-300 mt-1">
                        {task.description}
                      </p>
                      <p className="text-sm text-zinc-500 mt-2">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic">
                  No tasks in this category.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeProfile;
