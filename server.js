const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let users = [];
io.on("connection", function (socket) {
  console.log("A user connected");
  // io.on("connection", function (socket) {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  users.push();
  io.sockets.emit("broadcast", {
    description: users + " client(s) connected!",
  });
  socket.on("disconnect", function () {
    users.pop();
    io.sockets.emit("broadcast", {
      description: "now only" + users + " client(s) connected!",
    });
  });
  // })

  socket.on("setUsername", function (data) {
    console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      socket.emit("userSet", { username: data });
    }
  });

  socket.on("msg", function (data) {
    //Send message to everyone
    io.sockets.emit("newmsg", data);
  });
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
