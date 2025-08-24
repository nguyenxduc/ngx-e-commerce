import { desc } from "framer-motion/client";
import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product type name is required"],
    unique: true,
  },

  description: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("ProductType", productTypeSchema);
