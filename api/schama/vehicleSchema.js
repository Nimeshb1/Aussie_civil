import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    engine: {
      type: String,
      required: true,
    },

    gvm: {
      type: Number,
      required: true,
    },

    make: {
      type: String,
      required: true,
    },

    model: { type: String, required: true },

    net: { type: Number, required: true },

    address: {
      type: String,
      required: true,
    },

    rego: {
      type: String,
      required: true,
    },

    tare: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    vin: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("vehicle", vehicleSchema);
