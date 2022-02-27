const http = require("http");
setInterval(() => {
  http.get("http://alpha-tictactoe-zero-dual-mode.herokuapp.com");
}, 300000);
