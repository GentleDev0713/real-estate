require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");

// const submitRoute = require("./routes/SubmitListing");

const app = express();

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/").catch((err) => {
  console.log(err, "err in  connecting");
});

app.use(
  cookieSession({
    name: "session",
    keys: ["buyhomeforless"],
  })
);

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

app.use("/", router);

const port = process.env.PORT || 3003;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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
