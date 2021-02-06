const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const institutionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required."],
      unique: true,
    },
    taxNumber: {
      type: Number,
      required: [true, "Your tax identification is required"],
      unique: true,
      trim: true,
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

module.exports = model("Institution", modelSchema);
