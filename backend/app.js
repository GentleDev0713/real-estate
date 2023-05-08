const express = require("express");
const mongoose = require("mongoose");
const submitListingRouter = require("./routes/SubmitListing");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");

// const submitRoute = require("./routes/SubmitListing");

const app = express();

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/").catch((err) => {
  console.log(err, "err in  connecting");
});

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

app.use("/submitlisting", submitListingRouter);
app.use("/", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(3003, () => {
  console.log("Backend is Running");
});
// app.use(
//   cors({
//     origin: "http://localhost:3003",
//   })
// );

// app.use(cors());

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat.users is not define");

      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  });
});
