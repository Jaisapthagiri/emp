import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const ChatWindow = () => {
    const { user } = useAuth();
    const { selectedUser, messages, sendMessage, markMessagesAsSeen } = useChat();
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            markMessagesAsSeen(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedUser) return;
        sendMessage(text.trim());
        setText("");
    };

    if (!selectedUser)
        return <div className="flex-1 flex items-center justify-center text-gray-500">Select a user to chat</div>;

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-semibold text-indigo-600 dark:text-indigo-400">
                {selectedUser.name}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-900">
                {messages.map((m) => (
                    <div
                        key={m._id}
                        className={`max-w-xs md:max-w-md mb-2 p-2 rounded-lg wrap-break-word ${
                            m.senderId === user._id
                                ? "ml-auto bg-indigo-600 text-white"
                                : "mr-auto bg-white dark:bg-zinc-700 text-black dark:text-white"
                        }`}
                    >
                        {m.text}
                        <div className="text-xs mt-1 text-gray-200 dark:text-gray-400 text-right">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="p-4 border-t border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex"
            >
                <input
                    type="text"
                    className="flex-1 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 mr-2 bg-white dark:bg-zinc-700 dark:text-white"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
