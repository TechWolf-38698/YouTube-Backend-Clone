const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creating the schema
const videoViewsSchema = new Schema({
  channel: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: Schema.Types.ObjectId, required: true, ref: "Video" },
  userIp: { type: String, required: true },
  date: { type: Schema.Types.Date, default: Date.now() },
});

const videoViews = mongoose.model("videoViews", videoViewsSchema);
videoViews.createIndexes();
module.exports = videoViews;
