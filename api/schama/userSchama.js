import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      unique: true,
      index: 1,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      index: 1,
    },
    password: {
      type: String,
      required: true,
    },
    validation: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
  },
  { truestamp: true }
);

export default mongoose.model("user", userSchema);
