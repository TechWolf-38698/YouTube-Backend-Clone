const express = require("express");
const Subscribers = require("../models/Subscribers");
const video = require("../models/video");
const videoHistory = require("../models/videoHistory");
const videoLikes = require("../models/videoLikes");
const WatchLater = require("../models/WatchLater");
const router = express.Router();

router.get("/library/CountByUser", async (req, res) => {
  const { id } = req.query;
  try {
    let likes = await videoLikes
      .countDocuments({ user: id, state: "liked" })
      .exec();
    let videos = await video.countDocuments({ channel: id }).exec();
    let subs = await Subscribers.countDocuments({ user: id }).exec();
    res.status(200).send({ likes, videos, subs });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/library/History", async (req, res) => {
  const { id } = req.query;
  try {
    let history = await videoHistory
      .find({ viewer: id })
      .limit(8)
      .sort({ date: -1 })
      .populate({ path: "video", populate: { path: "channel" } })
      .exec();
    let count = await videoHistory.countDocuments({ viewer: id }).exec();
    res.status(200).send({ count, data: history });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/library/LikedVideos", async (req, res) => {
  const { id } = req.query;
  try {
    let videos = await videoLikes
      .find({ user: id, state: "liked" })
      .limit(8)
      .sort({ date: -1 })
      .populate({ path: "video", populate: { path: "channel" } })
      .exec();
    let count = await videoLikes
      .countDocuments({
        user: id,
        state: "liked",
      })
      .exec();
    res.status(200).send({ count, data: videos });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/library/WatchLater", async (req, res) => {
  const { id } = req.query;
  try {
    let videos = await WatchLater.find({ user: id, state: true })
      .limit(8)
      .sort({ date: -1 })
      .populate({ path: "video", populate: { path: "channel" } })
      .exec();
    let count = await WatchLater.countDocuments({
      user: id,
      state: true,
    }).exec();
    res.status(200).send({ count, data: videos });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
