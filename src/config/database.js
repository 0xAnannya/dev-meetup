const mongoose = require("mongoose");

const clusterURI =
  "mongodb+srv://0xanannya:K7bBeVjAmmfpL0Xg@cluster0.kqqjlhf.mongodb.net/DevMeetUp";

// ise async-await coz it is returning a promise
// and we want to wait for it to resolve before proceeding
const connectDB = async () => {
  await mongoose.connect(clusterURI);
};
module.exports = connectDB;
