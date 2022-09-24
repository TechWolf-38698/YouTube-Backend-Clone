const mongoose = require("mongoose");
const { Schema } = mongoose;

const historySchema = new Schema({
  video: { type: Schema.Types.ObjectId, required: true, ref: "Video" },
  viewer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Schema.Types.Date, required: true },
});

const videoHistory = mongoose.model("videoHistory", historySchema);
videoHistory.createIndexes();
module.exports = videoHistory;
