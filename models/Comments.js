const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: Schema.Types.ObjectId, required: true, ref: "Video" },
  comment: { type: String, required: true },
  date: { type: Schema.Types.Date, default: Date.now() },
});

const CommentModal = mongoose.model("Comments", schema);
CommentModal.createIndexes();
module.exports = CommentModal;
