import mongoose, { Schema } from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    licence: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { truestamp: true }
);

export default mongoose.model("driver", driverSchema);
