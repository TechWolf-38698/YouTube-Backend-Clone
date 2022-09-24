const express = require("express");
const router = express.Router();
const WatchLater = require("../models/WatchLater");

router.post("/watchLater/add", async (req, res) => {
  let payload = req.body;
  let custom = {
    user: payload.user,
    video: payload.video,
    state: true,
  };
  let foundStats = await WatchLater.findOne(payload).exec();
  if (!foundStats) {
    try {
      let add = new WatchLater(custom);
      add.save();
      res.sendStatus(200);
    } catch (err) {
      res.send(err).status(500);
    }
  } else {
    if (foundStats.state === true) {
      try {
        foundStats.state = false;
        foundStats.save();
        res.sendStatus(200);
      } catch (error) {
        res.send(err).status(500);
      }
    } else {
      try {
        foundStats.state = true;
        foundStats.save();
        res.sendStatus(200);
      } catch (error) {
        res.send(err).status(500);
      }
    }
  }
});

router.get("/watchLater/getByUserId/:id", async (req, res) => {
  let uId = req.params.id;
  let foundVideos = await WatchLater.find({ user: uId }).exec();
  res.send(foundVideos).status(200);
});
router.get("/watchLater/getByUserIdWithRelation/:id", async (req, res) => {
  let uId = req.params.id;
  try {
    let foundVideos = await WatchLater.find({ user: uId, state: true })
      .populate({ path: "video", populate: { path: "channel" } })
      .exec();
    res.send(foundVideos).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

module.exports = router;
