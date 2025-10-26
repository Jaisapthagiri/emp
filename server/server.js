import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import http from 'http';

import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { userSocketMap, setIO } from './socketStore.js';
import adminRouter from './routes/adminRouter.js';
import employeeRouter from './routes/employeeRouter.js';
import chatRouter from './routes/chatRouter.js';


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

await connectDB();

app.use(express.json({ limit: '4mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).send('server is running...');
});
app.use('/api/admin', adminRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/chat', chatRouter);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

setIO(io);

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User Connected:', userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit('getConnection', Object.keys(userSocketMap));

    socket.on('taskUpdated', ({ employeeId, updatedTask }) => {
        const targetSocket = userSocketMap[employeeId];
        if (targetSocket) {
            io.to(targetSocket).emit('taskUpdated', updatedTask);
        }
    });

    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', {
                senderId,
                text,
                createdAt: new Date(),
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected:', userId);
        if (userId) delete userSocketMap[userId];
        io.emit('getConnection', Object.keys(userSocketMap));
    });
});

server.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

export { io };
export default app;