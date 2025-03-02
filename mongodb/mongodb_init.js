const { config } = require("dotenv");
const { mongoose } = require("mongoose");

const { parsed } = config();

const mongodb = mongoose
  .connect(parsed.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = mongodb;
