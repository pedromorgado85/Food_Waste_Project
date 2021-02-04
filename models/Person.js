const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const personSchema = new Schema(
  {
    name: String,
    occupation: String,
    catchPhrase: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Person", modelSchema);
