const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creating the schema
const VideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  playlist: { type: Array, required: false },
  visibility: { type: String, required: true },
  videoURL: { type: String, required: true, unique: true },
  thumbnailUrl: { type: String, required: true },
  userId: { type: String, required: false },
  channelName: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

const video = mongoose.model("Video", VideoSchema);
video.createIndexes();
module.exports = video;
