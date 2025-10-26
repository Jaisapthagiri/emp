import { useAuth } from "../../context/AuthContext";
import { FaEnvelope, FaBriefcase, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Loading from "../Loading";

const EmployeeProfile = () => {
  const { user, myTasks, fetchMyTasks } = useAuth();
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({ pending: 0, inProgress: 0, completed: 0 });

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      await fetchMyTasks();
      setLoading(false);
    };
    loadTasks();
  }, [fetchMyTasks]);

  // Compute task stats whenever tasks change
  useEffect(() => {
    const stats = { pending: 0, inProgress: 0, completed: 0 };
    myTasks.forEach(task => {
      if (task.status === "pending") stats.pending += 1;
      else if (task.status === "in-progress") stats.inProgress += 1;
      else if (task.status === "completed") stats.completed += 1;
    });
    setTaskStats(stats);
  }, [myTasks]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700">
      
      {/* Header */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={`https://ui-avatars.com/api/?name=${user.name[0]}&background=4F46E5&color=fff&size=128`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-indigo-500"
        />
        <div>
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user.name}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{user.role.toUpperCase()}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-indigo-500" />
          <span className="text-zinc-700 dark:text-zinc-300">{user.email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <FaBriefcase className="text-indigo-500" />
          <span className="text-zinc-700 dark:text-zinc-300">{user.position || "-"}</span>
        </div>
        <div className="flex items-center space-x-3">
          <FaBuilding className="text-indigo-500" />
          <span className="text-zinc-700 dark:text-zinc-300">{user.department || "-"}</span>
        </div>
        <div className="flex items-center space-x-3">
          <FaCalendarAlt className="text-indigo-500" />
          <span className="text-zinc-700 dark:text-zinc-300">
            {new Date(user.dateOfJoining).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Task Stats */}
      <div className="bg-indigo-50 dark:bg-zinc-700 p-6 rounded-xl shadow-inner flex justify-around text-center">
        <div>
          <h2 className="text-xl font-bold text-indigo-600">{taskStats.pending}</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Pending</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-500">{taskStats.inProgress}</h2>
          <p className="text-zinc-600 dark:text-zinc-300">In Progress</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-600">{taskStats.completed}</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Completed</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
