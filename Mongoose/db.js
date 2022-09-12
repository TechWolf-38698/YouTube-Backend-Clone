const mongoose = require("mongoose");
//Abdur_Rahman
// arjawad123;
const connectionString = "mongodb://localhost:27017";
// const connectionString =
//   "mongodb+srv://Abdur_Rehman:arjawad123@yt-practice.oukvq.mongodb.net/?retryWrites=true&w=majority";

const connectMongoose = () => {
  mongoose
    .connect(connectionString)
    .then(() => console.log("connected"))
    .catch((e) => console.log(e));
};

module.exports = connectMongoose;
