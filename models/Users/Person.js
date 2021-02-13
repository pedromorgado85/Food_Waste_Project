const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    

    description: String,

    donations: [{ type: Schema.Types.ObjectId, ref: "Donation" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Person", schema);
