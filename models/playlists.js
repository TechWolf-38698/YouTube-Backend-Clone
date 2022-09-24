const mongoose = require("mongoose");
const { Schema } = mongoose;

const mySchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  visibility: { type: Schema.Types.String, required: true },
  date: { type: Schema.Types.Date, required: true, default: Date.now() },
});

const playlists = mongoose.model("playlists", mySchema);
playlists.createIndexes();
module.exports = playlists;
