const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const donationSchema = new Schema(
  {
    donor_id: {
      type: Schema.Types.ObjectId,
      required: [true, "Donor id is required"],
    },
    donor_type: {
      type: String,
      required: [true, "Donor type is required"],
      enum: ["institution", "company", "person"],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Donation", modelSchema);
