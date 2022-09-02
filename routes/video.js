const express = require("express");
const video = require("../models/video");
const router = express.Router();
const extractFrames = require("ffmpeg-extract-frames");

const baseUrl = "http://127.0.0.1:5000";

router.post("/video/postDetails", async (req, res) => {
  // If there are no errors, get data from the request
  const { formData, playlist } = req.body;
  const { _id, title, description, visibility, videoURL, userId, channelName } =
    formData;
  try {
    let myVid = await video.findById(_id);
    myVid.title = title;
    myVid.description = description;
    myVid.visibility = visibility;
    myVid.save();
    res.send({ msg: "Updated", myVid });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post("/video/postVideo", async (req, res) => {
  const file = req.files.video;
  let extension = file.mimetype.split("/");
  extension = extension[extension.length - 1];
  let name = `${Date.now()}_${Math.round(Math.random() * (1000000 - 1) + 1)}`;
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
        let _path = path.split("public")[1];
        let imgPath = `./public/thumbnails/${name}.png`;
        // For Thumbnail
        extractFrames({
          input: path,
          output: imgPath,
          offsets: [1000],
        });

        let myPath = imgPath.split("public")[1];

        try {
          const myVid = new video({
            title: file.name,
            description: "",
            playlist: "",
            visibility: "private",
            videoURL: _path,
            userId: req.body.userId,
            channelName: req.body.channelName,
            thumbnailUrl: myPath,
          });
          myVid.save();
          // Return the user & success message
          res.send({
            msg: "Video Uploaded successfully",
            details: { myVid },
          });
        } catch (err) {
          console.log(err);
          res.status(500).send("Server Error");
        }
      }
    });
  } else {
    res.status(400).send({ status: "error", message: "Invalid file type" });
  }
});

// http://127.0.0.1:5000/api/video/getall
router.get("/video/getall", (req, res) => {
  video.find({ visibility: { $ne: "private" } }, function (err, foundStats) {
    if (err) throw err;
    res.send(foundStats).status(200);
  });
});

// http://127.0.0.1:5000/api/video/getbyid/:id
router.get("/video/getbyid/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    // get user from the database by email
    let Video = await video.findOne({ _id });
    // If the user doesn't exist, return message
    if (!Video) {
      return res.status(400).json({ msg: "User does not exist" });
    } else {
      res.send({ Video });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
