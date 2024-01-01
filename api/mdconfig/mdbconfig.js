import mongoose from "mongoose";

export const mongoConnect = async () => {
  try {
    if (!process.env.MONGO_CLIENT) {
      console.log("Not valid URl");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_CLIENT);

    conn ? console.log("Mongo Connected") : console.log(error);
  } catch (error) {
    console.log(error);
  }
};
