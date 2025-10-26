import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  query: {
    userId: user?._id,
  },
});

export default socket;
