const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

let clients = 0;

io.on("connection", function (socket) {
  clients++;
  io.sockets.emit("broadcast", {
    description: clients + " clients connected!",
  });
  socket.on("disconnect", function () {
    clients--;
    io.sockets.emit("broadcast", {
      description: clients + " clients connected!",
    });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
