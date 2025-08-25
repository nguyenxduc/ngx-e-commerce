import Follower from "../models/follower.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const follow = async (req, res) => {
  try {
    const { shopId } = req.body;
    const userId = req.user.id;

    const shop = await Shop.findById(shopId);
    if (!shop || shop.status !== "approved") {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existingFollow = await Follower.findOne({
      user: userId,
      shop: shopId,
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this shop" });
    }

    const follow = new Follower({
      user: userId,
      shop: shopId,
    });

    await follow.save();

    const populatedFollow = await Follower.findById(follow._id).populate({
      path: "shop",
      select: "name logo description",
    });

    res.status(201).json({
      message: "Followed shop successfully",
      follow: populatedFollow,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to follow shop", error: error.message });
  }
};

export const unfollow = async (req, res) => {
  try {
    const { shopId } = req.body;
    const userId = req.user.id;

    const follow = await Follower.findOneAndDelete({
      user: userId,
      shop: shopId,
    });

    if (!follow) {
      return res.status(404).json({ message: "Follow relationship not found" });
    }

    res.json({ message: "Unfollowed shop successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to unfollow shop", error: error.message });
  }
};

export const getUserFollows = async (req, res) => {
  try {
    const userId = req.user.id;
    const follows = await Follower.find({ user: userId });
    res.json(follows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user follows", error: error.message });
  }
};

export const getShopFollowers = async (req, res) => {
  try {
    const { shopId } = req.params;
    const followers = await Follower.find({ shop: shopId });
    res.json(followers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get shop followers", error: error.message });
  }
};

export const checkFollowStatus = async (req, res) => {
  try {
    const { shopId } = req.query;
    const userId = req.user.id;

    if (!shopId) {
      return res.status(400).json({ message: "Shop ID is required" });
    }

    const follow = await Follower.findOne({
      user: userId,
      shop: shopId,
    });

    res.json({
      isFollowing: !!follow,
      follow,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to check follow status", error: error.message });
  }
};
