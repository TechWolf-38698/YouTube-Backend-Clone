const express = require("express");
const CommentModal = require("../models/Comments");
const router = express.Router();

router.post("/comments/add", (req, res) => {
  try {
    let comment = CommentModal(req.body);
    comment.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/comments/getByVId/:id", async (req, res) => {
  let vId = req.params.id;
  let comments = await CommentModal.find({ video: vId })
    .populate({ path: "user" })
    .exec();
  try {
    // console.log(comments);
    res.send(comments).status(200);
  } catch (err) {
    // console.log(err);
    res.send(err).status(500);
  }
});

module.exports = router;
