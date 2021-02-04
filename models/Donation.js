const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const donationSchema = new Schema(
  {
    name: String,
    occupation: String,
    catchPhrase: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Donation", modelSchema);
