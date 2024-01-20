const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app); //http server using express

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
}); //allow us to use socket.io

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    if (data.room !== "") socket.join(data);
    else socket.join("");
  });
  socket.on("send_meassage", (data) => {
    if (data.room === "")
      io.emit("receive_message", {
        res: data.message,
        id: socket.id,
        room: "",
      });
    else
      io.to(data.room).emit("receive_message", {
        res: data.message,
        id: socket.id,
        room: data.room,
      });
  });
});

server.listen(8080, () => console.log("Server listening..."));
