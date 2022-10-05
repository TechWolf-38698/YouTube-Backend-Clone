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
// Get All by user ID;
router.get("/playlist/getByUserId/:id", async (req, res) => {
  let user = req.params.id;
  try {
    let foundItems = await playlists.find({ user });
    res.send(foundItems).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});
// Add Video or Delete it.
router.post("/playlist/video/toggle", async (req, res) => {
  let foundItem = await PlaylistVideos.findOne(req.body).exec();
  if (foundItem) {
    if (foundItem.state === true) {
      try {
        foundItem.state = false;
        foundItem.date = Date.now();
        foundItem.save();
        res.send("Deleted").status(200);
      } catch (err) {
        res.send(err).status(500);
      }
    } else {
      try {
        foundItem.state = true;
        foundItem.date = Date.now();
        foundItem.save();
        res.send("Deleted").status(200);
      } catch (err) {
        res.send(err).status(500);
      }
    }
  } else {
    let item = new PlaylistVideos(req.body);
    item.state = true;
    item.date = Date.now();
    try {
      item.save();
      res.send("Added").status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  }
});
// Check if video exist in the playlist
router.post("/playlist/video/getByUserIdAndVIdeoId", async (req, res) => {
  let payload = req.body;
  payload.state = true;
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
// Get Playlist videos?
router.get("/playlist/videos/getByPlaylist", async (req, res) => {
  const { id } = req.query;
  try {
    let videos = await PlaylistVideos.find({ playlist: id })
      .populate({ path: "video", populate: { path: "channel" } })
      .populate({ path: "playlist", select: { name: 1, _id: 0 } });

    videos.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    let custom = [];
    for (let i = 0; i < videos.length; i++) {
      const e = videos[i];
      if (e.state === true) {
        custom.push(e);
      }
    }

    res.status(200).send({
      videos: custom,
      lastUpdated: videos[0].date,
      playlistName: videos[0].playlist.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
