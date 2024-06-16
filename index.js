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

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    io.emit("newUserResponse", users);
  });

   // Listen for direct messages
   socket.on("directMessage", async ({ recipientId, message }) => {
    try {
      // Store the message in the database using Prisma
      await prisma.message.create({
        data: {
          senderId: socket.id,
          recipientId,
          message,
        },
      });

      // Send the message to the specific user
      io.to(recipientId).emit("directMessage", {
        senderId: socket.id,
        message,
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
