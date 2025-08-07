const mongoose = require("mongoose");

require("dotenv").config();

const connnectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("Connection error", err.message);
      process.exit(1);
    });
};


module.exports = connnectDb;