const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creating the schema
const VideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  playlistIds: [
    { type: Schema.Types.ObjectId, required: false, ref: "Playlists" },
  ],
  visibility: { type: String, required: true },
  videoURL: { type: String, required: true, unique: true },
  thumbnailUrl: { type: String, required: true },
  channel: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, default: Date.now },
  views: [{ type: Schema.Types.ObjectId, required: false, ref: "videoViews" }],
  likes: [{ type: Schema.Types.ObjectId, required: false, ref: "videoLikes" }],
});

const video = mongoose.model("Video", VideoSchema);
video.createIndexes();
module.exports = video;
