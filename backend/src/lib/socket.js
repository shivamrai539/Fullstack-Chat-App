import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"]
  }
});

// it will return socket id when passing userID.
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online Users
// {userId : socketId} store like this

const userSocketMap = {};


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    // this brodcast every single user which is connected 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect" , () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
    
})
export { io, app, server };