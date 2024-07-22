import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import noteRoutes from "../api/routes/noteRoutes";
import authRoutes from "../api/routes/authRoutes";
import chatRoutes from "../api/routes/chatRoutes";
import UserSocket from "../api/models/userSocketModel";
import Chat, { IMessage } from "../api/models/chatModel";
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 9000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Database connection error:", error));

app.use("/api", noteRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  socket.on("register", async (userId) => {
    try {
      let user = await UserSocket.findOne({ userId: userId });
      //creating new user socket with userid and socket id
      if (!user) {
        user = new UserSocket({ userId: userId, socketId: socket.id });
      } else {
        user.socketId = socket.id; //for existing user
      }
      await user.save();
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      console.log("User disconnected: " + socket.id);
      const user = await UserSocket.findOne({ socketId: socket.id });
      if (user) {
        user.socketId = null;
        await user.save();
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  socket.on("send_message", async (data: IMessage) => {
    try {

      //find chat
      let chat = await Chat.findOne({
        $or: [
          { user1: data.senderId, user2: data.receiverId },
          { user1: data.receiverId, user2: data.senderId },
        ],
      });

      //already chat is there
      if (chat) {
        chat.timestamp = new Date();
        chat.messages.push(data);
      } else {
        chat = new Chat({
          user1: data.senderId,
          user2: data.receiverId,
          messages: [data],
        });
      }
      //save chat
      const savedChat = await chat.save();
      //populating username
      const newChat = await Chat.findById(savedChat._id)
        .populate("user1", "username")
        .populate("user2", "username");

      const newMessage = newChat?.messages[newChat.messages.length - 1];

      const newChatWithoutMessages = {
        _id: newChat?._id,
        user1: newChat?.user1,
        user2: newChat?.user2,
        timestamp: newChat?.timestamp,
        is_deleted1: newChat?.is_deleted1,
        is_deleted2: newChat?.is_deleted2,
        messages: []
      }

      const user = await UserSocket.findOne({ userId: data.receiverId });
      if (user && user.socketId) {
        io.to(user.socketId).emit('receive_message', { newMessage, newChatWithoutMessages });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on(
    "mark_as_read",
    async (data: { chatId: string; receiverId: string }) => {
      try {
        const selectedChat = await Chat.findById(data.chatId);
        if (!selectedChat) {
          throw new Error("Chat not found");
        }

        selectedChat.messages = selectedChat.messages.map((message) => {
          if (
            message.receiverId.toString() === data.receiverId &&
            !message.readReceipt
          ) {
            message.readReceipt = true;
          }
          return message;
        });
        await selectedChat.save();

      const senderId = selectedChat.user1.toString() === data.receiverId ? selectedChat.user2 : selectedChat.user1;
      const user = await UserSocket.findOne({ userId: senderId });


      if (user && user.socketId) {
        io.to(user.socketId).emit('receive_marked_as_read', data);
      }
    }
  );
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
