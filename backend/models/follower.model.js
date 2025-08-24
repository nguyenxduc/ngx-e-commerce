import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop is required"],
    },
  },
  {
    timestamps: true,
  }
);

followerSchema.index({ user: 1, shop: 1 }, { unique: true });
followerSchema.index({ user: 1 });
followerSchema.index({ shop: 1 });

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;
