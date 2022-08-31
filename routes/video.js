const express = require("express");
const video = require("../models/video");
const router = express.Router();

router.post("/video/postDetails", async (req, res) => {
  // If there are no errors, get data from the request
  const { formData, playlist } = req.body;
  const { Title, Description, Visibility, videoURL, userId, channelName } =
    formData;
  try {
    user = await video.create({
      title: Title,
      description: Description,
      playlist: playlist,
      visibility: Visibility,
      videoURL: videoURL,
      userId: userId,
      channelName: channelName,
    });
    // Return the user & success message
    res.send({ msg: "Video Uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});
// http://127.0.0.1:5000/api/video/getall
router.get("/video/getall", (req, res) => {
  // var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  // console.log(ip);
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
