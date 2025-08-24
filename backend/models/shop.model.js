import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Shop description is required"],
    },
    logo: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shop owner is required"],
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: [0, "Total ratings cannot be negative"],
    },
    followers: {
      type: Number,
      default: 0,
      min: [0, "Followers count cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.index({ name: "text", description: "text" });

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
