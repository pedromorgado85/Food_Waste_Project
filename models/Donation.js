const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    donor_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Donor id is required'],
    },
    donor_type: {
      type: String,
      required: [true, 'Donor type is required'],
      enum: ['institution', 'company', 'person'],
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Receiver id is required'],
    },
    receiver_type: {
      type: String,
      required: [true, 'Receiver type is required'],
      enum: ['institution', 'company', 'person'],
    },
    description: {
      type: String,
      required: [true, 'The Donation description is required.'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Donation', schema);
