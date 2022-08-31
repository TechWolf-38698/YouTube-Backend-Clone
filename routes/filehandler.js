const express = require("express");
const router = express.Router();
// const extractFrames = require("ffmpeg-extract-frames");

// http://127.0.0.1:5001/uploads/video

router.post("/video/postVideo", function (req, res) {
  const file = Object.values(req.files)[0];
  let extension = file.mimetype.split("/");
  extension = extension[extension.length - 1];
  let name = `${Date.now()}${Math.random() * (10 - 1) + 1}`;
  var path = __dirname + "/../public/videos/" + name + "." + extension;
  path = path.toLowerCase();
  path = path.replace(/ /g, "_");
  if (
    extension === "mov" ||
    extension === "mpeg-1" ||
    extension === "mpeg-2" ||
    extension === "mpeg4" ||
    extension === "mp4" ||
    extension === "mpg" ||
    extension === "avi" ||
    extension === "wmv" ||
    extension === "mpegps" ||
    extension === "flv" ||
    extension === "3gpp" ||
    extension === "webm" ||
    extension === "dnxhr" ||
    extension === "prores" ||
    extension === "cineform" ||
    extension === "hevc"
  ) {
    file.mv(path, (err) => {
      if (err) {
        return res.status(500).send("Something went wrong");
      } else {
        let _path = "http://127.0.0.1:5000" + path.split("public")[1];
        // For Thumbnail
        // extractFrames({
        //   input: path,
        //   output: `./public/thumbnails/${name}.png`,
        //   offsets: [1000],
        // });
        
        return res
          .send({
            _path: _path,
          })
          .status(200);
      }
    });
  } else {
    res.status(400).send({ status: "error", message: "Invalid file type" });
  }
});

// http://127.0.0.1:5001/uploads/img

router.post("/img", function (req, res) {
  const file = Object.values(req.files)[0];
  let extension = file.mimetype.split("/");
  extension = extension[extension.length - 1];
  var path = __dirname + "/../public/images/" + Date.now() + "." + extension;
  path = path.toLowerCase();
  path = path.replace(/ /g, "_");
  if (
    extension === "jpg" ||
    extension === "gif" ||
    extension === "tif" ||
    extension === "emf" ||
    extension === "bmp" ||
    extension === "png" ||
    extension === "jpeg"
  ) {
    file.mv(path, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        path = "http://127.0.0.1:5001" + path.split("public")[1];
        return res.send({
          _status: "success",
          _path: path,
          _extension: extension,
        });
      }
    });
  } else {
    res.status(400).send({ status: "error", message: "Invalid file type" });
  }
});

// router.post("/video", (req, res) => {
//   // res.send(Object.values(req.files)[0]);
//   console.log(Object.values(req.files)[0].mimetype);
// });

module.exports = router;
