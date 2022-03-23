const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5500", "https://admin.socket.io/"],
  },
});

const userIo = io.of("/user");

userIo.on("connection", (socket) => {
  console.log("CONNECTED TO USER NAMESPACE", socket.id);
});

io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id);
  socket.on("send-message", (message, room) => {
    console.log(message);
    if (room === "") {
      socket.broadcast.emit("pass-message", message);
    } else {
      socket.to(room).emit("pass-message", message);
    }
  });
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`joined room: ${room}`);
  });
});

instrument(io, { auth: false });
