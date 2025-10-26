import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../context/ChatContext";

const Chat = () => {
    const { getUsers } = useChat();

    useEffect(() => {
        getUsers(); // fetch users on mount
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
            <Sidebar />
            <ChatWindow />
        </div>
    );
};

export default Chat;
