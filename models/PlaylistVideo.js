const mongoose = require("mongoose");
const { Schema } = mongoose;

let mySchema = new Schema({
  video: { type: Schema.Types.ObjectId, required: true, ref: "Video" },
  playlist: { type: Schema.Types.ObjectId, required: true, ref: "playlist" },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Schema.Types.Date, default: Date.now() },
});

let PlaylistVideos = mongoose.model("PlaylistVideos", mySchema);
PlaylistVideos.createIndexes();
module.exports = PlaylistVideos;
