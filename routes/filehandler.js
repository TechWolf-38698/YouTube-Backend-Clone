const express = require("express");
const router = express.Router();
// const extractFrames = require("ffmpeg-extract-frames");

// http://127.0.0.1:5001/uploads/video


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
