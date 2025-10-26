import React from "react";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
    const { users, setSelectedUser, selectedUser, unseenMessages } = useChat();

    return (
        <div className="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 overflow-y-auto">
            <h2 className="p-4 font-bold text-indigo-600 mt-10 dark:text-indigo-400">Chats</h2>
            {users.map((u) => (
                <div
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex justify-between items-center p-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-zinc-700 ${
                        selectedUser?._id === u._id ? "bg-indigo-100 dark:bg-zinc-700" : ""
                    }`}
                >
                    <span>{u.name}</span>
                    {unseenMessages[u._id] > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unseenMessages[u._id]}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
