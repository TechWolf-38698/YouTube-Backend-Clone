const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Subscribers = require("../models/Subscribers");
const User = require("../models/user");

// Subscribe
router.post("/subs/add", async (req, res) => {
  let foundSub = await Subscribers.findOne(req.body).exec();
  let foundUser = await User.findById(req.body.user).exec();
  let foundChannel = await User.findById(req.body.channel).exec();
  if (
    (foundSub === null || foundSub === undefined) &&
    (foundUser !== null || foundUser !== undefined) &&
    (foundChannel !== null || foundChannel !== undefined)
  ) {
    try {
      let addOne = Subscribers({
        _id: mongoose.Types.ObjectId(),
        user: req.body.user,
        channel: req.body.channel,
      });
      addOne.save();
      try {
        foundChannel.subscribers.push(addOne._id);
        foundChannel.save();
        foundUser.subscriptions.push(addOne._id);
        foundUser.save();
        res.send({ subs: foundChannel.subscribers.length }).status(200);
      } catch (error) {
        console.log(err, "err1");
      }
      //   res.sendStatus(200);
    } catch {
      (err) => {
        console.log(err, "err2");
        res.sendStatus(500);
      };
    }
  } else {
    res.sendStatus(400);
  }
});
// UnSubscribe
router.post("/subs/delete", async (req, res) => {
  let foundSub = await Subscribers.findOne(req.body).exec();
  let foundUser = await User.findById(req.body.user).exec();
  let foundChannel = await User.findById(req.body.channel).exec();
  if (
    foundSub !== null &&
    foundSub !== undefined &&
    foundUser !== null &&
    foundUser !== undefined &&
    foundChannel !== null &&
    foundChannel !== undefined
  ) {
    try {
      let a = foundUser.subscriptions.filter(
        (e) => e.toString() !== foundSub._id.toString()
      );
      let b = foundChannel.subscribers.filter(
        (e) => e.toString() !== foundSub._id.toString()
      );
      foundUser.subscriptions = a;
      foundUser.save();
      foundChannel.subscribers = b;
      foundChannel.save();
      foundSub.delete();
      res.send({ subs: foundChannel.subscribers.length }).status(200);
    } catch {
      (err) => {
        console.log(err, "err2");
        res.sendStatus(500);
      };
    }
  } else {
    res.sendStatus(400);
  }
});
// Get Subscribers Count
router.get("/subs/getCount/:cId", async (req, res) => {
  let subs = await Subscribers.find({ channel: req.params.cId }).exec();
  res.send({ subs: subs.length });
});
// Get Subscriptions By user Id
router.get("/subs/getSubscriptions/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    let subs = await Subscribers.find({ user: userId })
      .populate({ path: "channel", populate: { path: "subscribers" } })
      .exec();
    res.send(subs).status(200);
  } catch (err) {
    console.log(err);
    res.send(err).status(500);
  }
});

// router.get("/")

module.exports = router;
