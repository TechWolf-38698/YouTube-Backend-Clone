// Create a basic express server
const express = require("express");
const cors = require("cors");
const connectMongoose = require("./Mongoose/db");
const auth = require("./routes/auth");
const video = require("./routes/video");
const filehandler = require("./routes/filehandler");
const fileUpload = require("express-fileupload");
const path = require("path");

// Connect to MongoDB
connectMongoose();

// Creating the app
const app = express();
const port = 5000 || process.env.PORT;
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

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});