const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creating the schema
const UserSchema = new Schema({
  f_name: { type: String, required: true },
  l_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscribers: [
    { type: Schema.Types.ObjectId, required: true, ref: "Subscribers" },
  ],
  subscriptions: [
    { type: Schema.Types.ObjectId, required: true, ref: "Subscribers" },
  ],
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
User.createIndexes();
module.exports = User;
