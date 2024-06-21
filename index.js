require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/auth");
const socketio = require("socket.io");
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .send({ message: err.message, stack: err.stack });
});

app.use("/api/v1", router);

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //sends the message to all the users on the server
  socket.on("message", (data) => {
    io.emit("messageResponse", data);
  });

  socket.on("newUser", async (data) => {
    try {
      // Add the user to the in-memory users list
      users.push({ id: socket.id, name: data.name, });
      io.emit("newUserResponse", users);
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  });


  socket.on("directMessage", async ({ recipientId, message }) => {
    console.log("users", users)
    try {
      const sender = users.find(user => user.id === socket.id);
      const recipient = users.find(user => user.id === recipientId);

      if (!sender || !recipient) {
        console.error("Sender or recipient not found");
        return;
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId: sender.id,
          recipientId: recipient.id,
          content: message,
        },
      });

      io.to(recipientId).emit("directMessage", {
        senderId: sender.id,
        message: newMessage.content,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      console.error("Error sending direct message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});
