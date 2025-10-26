import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user?._id) return;

        const newSocket = io(import.meta.env.VITE_BACKEND_URL, { query: { userId: user._id } });
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [user]);

    useEffect(() => {
        const storedUser = localStorage.getItem("selectedUser");
        if (storedUser) {
            const userObj = JSON.parse(storedUser);
            setSelectedUser(userObj);
            getMessages(userObj._id);
        }
    }, []);

    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
            getMessages(selectedUser._id);
        } else {
            localStorage.removeItem("selectedUser");
            setMessages([]);
        }
    }, [selectedUser]);

    const getUsers = async () => {
        try {
            const { data } = await api.get("/chat/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (data.success) {
                setUsers(data.users || []);
                setUnseenMessages(data.unseenMessage || {});
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch users");
        }
    };

    const getMessages = async (userId) => {
        try {
            const { data } = await api.get(`/chat/messages/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (data.success) setMessages(data.messages || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch messages");
        }
    };

    const sendMessage = async (text) => {
        if (!selectedUser) return;

        try {
            const { data } = await api.post(
                `/chat/send/${selectedUser._id}`,
                { text },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);

                socket?.emit("sendMessage", {
                    senderId: user._id,
                    receiverId: selectedUser._id,
                    text,
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send message");
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            if (selectedUser && message.senderId === selectedUser._id) {
                setMessages((prev) => [...prev, message]);

                api.patch(`/chat/messages/seen/${message._id}`, null, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }).catch(() => { });
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1,
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, selectedUser]);

    const markMessagesAsSeen = (userId) => {
        setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
    };

    return (
        <ChatContext.Provider
            value={{
                messages, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, getUsers, getMessages, sendMessage, markMessagesAsSeen,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
