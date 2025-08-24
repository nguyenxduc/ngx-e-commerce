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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Follower.countDocuments({ user: userId });
    const follows = await Follower.find({ user: userId })
      .populate({
        path: "shop",
        select: "name logo description address phone email",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      follows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user follows", error: error.message });
  }
};

export const getShopFollowers = async (req, res) => {
  try {
    const { shopId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const shop = await Shop.findById(shopId);
    if (!shop || shop.status !== "approved") {
      return res.status(404).json({ message: "Shop not found" });
    }

    const total = await Follower.countDocuments({ shop: shopId });
    const followers = await Follower.find({ shop: shopId })
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      shop,
      followers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get shop followers", error: error.message });
  }
};

export const updateFollowNotifications = async (req, res) => {
  try {
    const { followId } = req.params;
    const { notificationsEnabled } = req.body;
    const userId = req.user.id;

    const follow = await Follower.findOne({
      _id: followId,
      user: userId,
    });

    if (!follow) {
      return res.status(404).json({ message: "Follow relationship not found" });
    }

    follow.notificationsEnabled = notificationsEnabled;
    await follow.save();

    res.json({
      message: "Follow notifications updated",
      follow,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update follow notifications",
      error: error.message,
    });
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

export const getFollowStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalFollowing, totalFollowers] = await Promise.all([
      Follower.countDocuments({ user: userId }),
      Follower.countDocuments({ "shop.owner": userId }),
    ]);

    const recentFollows = await Follower.find({ user: userId })
      .populate({
        path: "shop",
        select: "name logo",
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      totalFollowing,
      totalFollowers,
      recentFollows,
    };

    res.json({ stats });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get follow stats", error: error.message });
  }
};
