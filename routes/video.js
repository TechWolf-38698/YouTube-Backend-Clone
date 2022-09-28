const express = require("express");
const video = require("../models/video");
const router = express.Router();
const extractFrames = require("ffmpeg-extract-frames");
const { default: mongoose } = require("mongoose");
const videoViews = require("../models/videoViews");
const videoHistory = require("../models/videoHistory");
const videoLikes = require("../models/videoLikes");

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
          // const channel = User.findById(req.body.channelId);
          // channel
          //   .exec()
          //   .then((myRes) => {
          //     console.log(myRes);

          //   })
          //   .catch((err) => {
          //     console.log(err);
          //     res.sendStatus(500);
          //   });
          const myVid = new video({
            title: file.name,
            description: "",
            playlist: [],
            visibility: "private",
            videoURL: _path,
            channel: mongoose.Types.ObjectId(req.body.channelId),
            thumbnailUrl: myPath,
          });
          myVid.save();
          res.send({
            msg: "Video Uploaded successfully",
            myVid,
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
router.get("/video/getall", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  results.page = page;
  try {
    let videos = await video.find({ visibility: "public" }).exec();
    results.totalVideos = videos.length;
    if (endIndex < videos.length) {
      results.hasMore = true;
    } else {
      results.hasMore = false;
    }
  } catch (err) {
    console.log(err);
  }
  try {
    results.videos = await video
      .find({ visibility: "public" })
      .populate({
        path: "channel",
        select: { _id: 0, password: 0, date: 0, __v: 0 },
      })
      .limit(limit)
      .skip(startIndex)
      .exec();

    res.send(results).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});
// http://127.0.0.1:5000/api/video/getbyid/:id
router.get("/video/getbyid/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    // get user from the database by email
    let Video = await video
      .findOne({ _id: _id })
      .populate({
        path: "channel",
        select: { password: 0 },
        populate: { path: "subscribers" },
      })
      .populate({ path: "likes" });
    // If the user doesn't exist, return message
    if (!Video) {
      return res.status(400).json({ msg: "Video not found" });
    } else if (Video.visibility === "private") {
      return res.status(403).json({ msg: "Video is private" });
    } else {
      let likes = Video.likes.filter((e) => e.state === "liked");
      let disLikes = Video.likes.filter((e) => e.state === "disLiked");
      let subs = Video.channel.subscribers;
      res.send({ Video, disLikes, likes, subs });
    }
  } catch (err) {
    res.status(500).send({ msg: "Server Error", err });
  }
});
router.post("/video/views/add", async (req, res) => {
  const fPayload = {
    video: req.body.vID,
    channel: req.body.cID._id,
    userIp: req.ip,
  };
  const payload = {
    _id: mongoose.Types.ObjectId(),
    video: req.body.vID,
    channel: req.body.cID._id,
    userIp: req.ip,
    date: Date.now(),
  };
  let foundView = await videoViews.find(fPayload).exec();
  if (foundView.length === 0) {
    try {
      let addView = videoViews(payload);
      addView.save();
      let currentVideo = await video.findById(payload.video).exec();
      currentVideo.views.push(addView._id);
      currentVideo.save();
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  } else if (foundView.length > 0) {
    try {
      let a = new Date(foundView[foundView.length - 1].date).getMinutes() + 10;
      let b = new Date(foundView[foundView.length - 1].date).setMinutes(a);
      if (b < Date.now()) {
        let addView = videoViews(payload);
        addView.save();
        let currentVideo = await video.findById(payload.video).exec();
        currentVideo.views.push(addView._id);
        currentVideo.save();
        res.sendStatus(200);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  } else {
    res.status(500).send("Something went wrong");
  }
});
router.get("/video/views/getCount/:vId", async (req, res) => {
  let vId = req.params.vId;
  let views = await videoViews
    .find({ video: mongoose.Types.ObjectId(vId) })
    .exec();
  res.send({ count: views.length }).status(200);
});
router.post("/video/history/add", async (req, res) => {
  const foundHistory = await videoHistory
    .findOne({
      video: req.body.vId,
      viewer: req.body.uId,
    })
    .exec();
  if (foundHistory === null || foundHistory === undefined) {
    try {
      let addHistory = await videoHistory({
        video: req.body.vId,
        viewer: req.body.uId,
        date: Date.now(),
      });
      addHistory.save();
      res.sendStatus(200);
    } catch {
      (err) => res.send(err);
    }
  } else {
    try {
      foundHistory.date = Date.now();
      foundHistory.save();
      res.sendStatus(200);
    } catch {
      (err) => res.send(err);
    }
  }
});
router.get("/video/history/get/:id", async (req, res) => {
  let uId = req.params.id;
  let foundHistory = await videoHistory
    .find({ viewer: uId })
    .sort({ date: -1 })
    .populate({ path: "video", populate: { path: "channel" } })
    .exec();
  // foundHistory.sort(function (a, b) {
  //   return new Date(b.date) - new Date(a.date);
  // });
  res.send(foundHistory).status(200);
});
router.post("/video/like", async (req, res) => {
  // {
  //   videoId: '6318650745787fc3f80546a2',
  //   channel: '630d77a043509a3668885112',
  //   userId: '630d77a043509a3668885112',
  //   state: 'liked'
  // }
  let foundLike = await videoLikes
    .findOne({
      user: req.body.user,
      video: req.body.video,
    })
    .exec();
  let foundVideo = await video.findById(req.body.video).exec();
  if (!foundLike && foundVideo) {
    try {
      let like = await videoLikes({
        _id: mongoose.Types.ObjectId(),
        user: req.body.user,
        video: req.body.video,
        channel: req.body.channel,
        state: req.body.state,
        date: Date.now(),
      }).save();
      foundVideo.likes.push(like._id);
      foundVideo.save();
      res.send("added").status(200);
    } catch {
      res.send("error adding").status(500);
    }
  } else if (foundLike && foundVideo) {
    try {
      foundLike.state = req.body.state;
      foundLike.date = Date.now();
      foundLike.save();
      res.send("added").status(200);
    } catch {
      res.send("error adding").status(500);
    }
  }
});
router.get("/video/like/getcount/:vId", async (req, res) => {
  let foundVideo = await video
    .findById(req.params.vId)
    .populate({ path: "likes" });
  let likes = foundVideo.likes.filter((e) => e.state === "liked").length;
  let disLikes = foundVideo.likes.filter((e) => e.state === "disLiked").length;
  res.send({ likes, disLikes }).status(200);
});
router.get("/videos/getTrending", async (req, res) => {
  let foundVideos = await video
    .find()
    .populate({ path: "channel", select: { password: 0, _v: 0 } })
    .exec();
  foundVideos
    .sort((a, b) => (b.views.length < a.views.length ? -1 : 1))
    .sort((a, b) => (b.likes.length < a.likes.length ? -1 : 1));
  res.send(foundVideos.slice(0, 10)).status(200);
});
router.get("/videos/getSubscriptions/:id", async (req, res) => {
  let id = req.params.id;
  let foundVideos = await video
    .find()
    .populate({ path: "channel", populate: { path: "subscribers" } });
  let filtered = [];
  if (foundVideos.length > 0) {
    for (let i = 0; i < foundVideos.length; i++) {
      const v = foundVideos[i];
      const c = v.channel;
      const subs = c.subscribers;
      if (subs.length !== 0) {
        for (let i = 0; i < subs.length; i++) {
          const s = subs[i].user._id;
          if (s.toString() === id) {
            filtered.push(v);
          }
        }
      }
    }
  } else {
  }
  res.send(filtered).status(200);
});
router.get("/videos/getLikedVideos/:id", async (req, res) => {
  let uId = req.params.id;
  try {
    let foundVideos = await videoLikes
      .find({ user: uId, state: "liked" })
      .populate({ path: "video", populate: { path: "channel" } });
    // console.log(foundVideos);
    res
      .send({ videos: foundVideos, lastUpdated: foundVideos[0].date })
      .status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});

module.exports = router;
