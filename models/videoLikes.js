const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  channel: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  state: { type: Schema.Types.String, required: true },
});

const videoLikes = mongoose.model("videoLikes", likeSchema);
videoLikes.createIndexes();
module.exports = videoLikes;
