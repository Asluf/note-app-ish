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
  }
});

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Database connection error:", error));

app.use("/api", noteRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);

  socket.on('register', async (userId) => {
    try {
      let user = await UserSocket.findOne({ userId: userId });
      if (!user) {
        user = new UserSocket({ userId: userId, socketId: socket.id });
      } else {
        user.socketId = socket.id;
      }
      await user.save();
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      console.log('User disconnected: ' + socket.id);
      const user = await UserSocket.findOne({ socketId: socket.id });
      if (user) {
        user.socketId = null;
        await user.save();
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });

  socket.on('send_message', async (data: IMessage) => {
    try {
      const user = await UserSocket.findOne({ userId: data.receiverId });
      // if (user && user.socketId) {
      //   io.to(user.socketId).emit('receive_message', data);
      // }
      // storing in the db
      let chat = await Chat.findOne({
        $or: [
          { user1: data.senderId, user2: data.receiverId },
          { user1: data.receiverId, user2: data.senderId }
        ]
      });

      if (chat) {
        chat.timestamp = new Date();
        chat.messages.push(data);
      } else {
        chat = new Chat({
          user1: data.senderId,
          user2: data.receiverId,
          messages: [data]
        });
      }

      const newChat = await chat.save();

      const newMessage = newChat.messages[newChat.messages.length - 1];

      if (user && user.socketId) {
        io.to(user.socketId).emit('receive_message', {newMessage, chatId:newChat._id});
      }

    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



/*
DONE implement chat recipient list Ui
DONE  implement chat inside ui

DONE implement context for store chat recipient with latest msg
DONE implement context for store all the messages inside previous context when going inside the chat  -> future implement fetch last 20 msgs only and fetch if scroll to old

DONE when sending msg need to store locally also. merge with previous.
implement receive msg socket listener to merge the new msg.
*/
