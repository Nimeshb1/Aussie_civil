import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  invoiceName: {
    type: String,
    required: true,
  },
});

export default mongoose.model("invoice", invoiceSchema);
