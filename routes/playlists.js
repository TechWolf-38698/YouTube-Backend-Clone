const express = require("express");
const playlists = require("../models/playlists");
const PlaylistVideos = require("../models/PlaylistVideo");
const router = express.Router();

// Create Playlist
router.post("/playlist/create", async (req, res) => {
  let item = new playlists(req.body);
  try {
    item.save();
    res.send(item).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});
router.get("/playlist/getByUserId/:id", async (req, res) => {
  let user = req.params.id;
  try {
    let foundItems = await playlists.find({ user });
    res.send(foundItems).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});
router.post("/playlist/video/toggle", async (req, res) => {
  let foundItem = await PlaylistVideos.findOne(req.body).exec();
  if (foundItem) {
    try {
      foundItem.delete();
      res.send("Deleted").status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  } else {
    let item = new PlaylistVideos(req.body);
    try {
      item.save();
      res.send("Added").status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  }
});
router.post("/playlist/video/getByUserIdAndVIdeoId", async (req, res) => {
  let payload = req.body;
  console.log(payload);
  let foundItems = await PlaylistVideos.find(payload, {
    playlist: 1,
    _id: 0,
  }).exec();
  let custom = [];
  if (foundItems.length !== 0) {
    for (let i = 0; i < foundItems.length; i++) {
      const e = foundItems[i];
      custom.push(e.playlist);
    }
  }
  res.send(custom).status(200);
});

module.exports = router;
