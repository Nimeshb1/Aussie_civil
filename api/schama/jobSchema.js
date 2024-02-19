import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: true,
    },
    jobaddress: {
      type: String,
      required: true,
    },
    tipaddress: {
      type: String,
      required: true,
    },
    rate: {
      type: String,
      required: true,
    },
    rego: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    cancle: {
      default: false,
      type: Boolean,
    },
    status: {
      default: "Scheduled",
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { truestamp: true }
);

export default mongoose.model("job", jobSchema);
