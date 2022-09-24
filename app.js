// Create a basic express server
const express = require("express");
const cors = require("cors");
const connectMongoose = require("./Mongoose/db");
const auth = require("./routes/auth");
const video = require("./routes/video");
const filehandler = require("./routes/filehandler");
const fileUpload = require("express-fileupload");
const path = require("path");
const subscribe = require("./routes/subscribers");
const comments = require("./routes/comments");
const WatchLater = require("./routes/WatchLater");
const Playlists = require("./routes/playlists");

// Connect to MongoDB
connectMongoose();

// Creating the app
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  let options = {
    root: path.join(`${__dirname}/public`),
  };
  res.sendFile("index.html", options, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.static("public"));
app.use("/api", auth);
app.use("/api", video);
app.use("/api", filehandler);
app.use("/api", subscribe);
app.use("/api", comments);
app.use("/api", WatchLater);
app.use("/api", Playlists);

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
