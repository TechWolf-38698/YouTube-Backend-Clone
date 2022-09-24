const mongoose = require("mongoose");
const { Schema } = mongoose;

const mySchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  state: { type: Schema.Types.Boolean, required: true },
  date: { type: Schema.Types.Date, default: Date.now() },
});

const WatchLater = mongoose.model("WatchLater", mySchema);
WatchLater.createIndexes();
module.exports = WatchLater;
