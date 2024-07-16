import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import noteRoutes from "./api/routes/noteRoutes";
import authRoutes from "./api/routes/authRoutes";
import chatRoutes from "./api/routes/chatRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(
  cors({
    origin: "http://localhost:5173", // Update this to match your frontend origin
    credentials: true,
  })
);
app.use(bodyParser.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Database connection error:", error));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to match your frontend origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    io.emit("message", data); // Broadcast message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api", noteRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
