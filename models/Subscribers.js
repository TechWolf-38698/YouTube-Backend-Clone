const mongoose = require("mongoose");
const { Schema } = mongoose;

const mySchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  channel: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Schema.Types.Date, default: Date.now() },
});

const Subscribers = mongoose.model("Subscribers", mySchema);
Subscribers.createIndexes();
module.exports = Subscribers;
