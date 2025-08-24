import Shop from "../models/shop.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Follower from "../models/follower.model.js";

export const createShop = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      description, 
      address, 
      contactInfo, 
      businessInfo,
      logo, 
      banner 
    } = req.body;

    const existingShop = await Shop.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, "i") } },
        { ownerId: userId },
      ],
    });

    if (existingShop) {
      return res.status(400).json({
        message: "Shop name already exists or user already has a shop",
      });
    }

    const shop = new Shop({
      name,
      description,
      address,
      contactInfo,
      businessInfo,
      logo,
      banner,
      ownerId: userId,
    });

    await shop.save();

    await User.findByIdAndUpdate(userId, { 
      role: "seller",
      shop: shop._id 
    });

    res.status(201).json({
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create shop", error: error.message });
  }
};

export const getAllShops = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const status = req.query.status;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    } else {
      query.status = "approved";
    }

    const total = await Shop.countDocuments(query);
    const shops = await Shop.find(query)
      .populate({
        path: "owner",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      shops,
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
      .json({ message: "Failed to get shops", error: error.message });
  }
};

export const getPendingShops = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Shop.countDocuments({ status: "pending" });
    const shops = await Shop.find({ status: "pending" })
      .populate({
        path: "owner",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      shops,
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
      .json({ message: "Failed to get pending shops", error: error.message });
  }
};

export const approveShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status !== "pending") {
      return res.status(400).json({ message: "Shop is not pending approval" });
    }

    shop.status = "approved";
    shop.approvedAt = new Date();
    await shop.save();

    res.json({
      message: "Shop approved successfully",
      shop,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve shop", error: error.message });
  }
};

export const rejectShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status !== "pending") {
      return res.status(400).json({ message: "Shop is not pending approval" });
    }

    shop.status = "rejected";
    shop.rejectionReason = reason;
    await shop.save();

    await User.findByIdAndUpdate(shop.owner, { role: "user" });

    res.json({
      message: "Shop rejected successfully",
      shop,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reject shop", error: error.message });
  }
};

export const suspendShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status === "suspended") {
      return res.status(400).json({ message: "Shop is already suspended" });
    }

    shop.status = "suspended";
    shop.suspensionReason = reason;
    await shop.save();

    res.json({
      message: "Shop suspended successfully",
      shop,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to suspend shop", error: error.message });
  }
};

export const reactivateShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status !== "suspended") {
      return res.status(400).json({ message: "Shop is not suspended" });
    }

    shop.status = "approved";
    shop.suspensionReason = undefined;
    await shop.save();

    res.json({
      message: "Shop reactivated successfully",
      shop,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reactivate shop", error: error.message });
  }
};

export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id).populate({
      path: "owner",
      select: "name email",
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status !== "approved") {
      return res.status(404).json({ message: "Shop not found" });
    }

    const productCount = await Product.countDocuments({
      shop: id,
      isActive: true,
    });

    const followerCount = await Follower.countDocuments({ shop: id });

    res.json({
      shop: {
        ...shop.toObject(),
        productCount,
        followerCount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get shop", error: error.message });
  }
};

export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, phone, email, logo, banner } = req.body;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (name && name !== shop.name) {
      const existingShop = await Shop.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id },
      });

      if (existingShop) {
        return res.status(400).json({ message: "Shop name already exists" });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (logo !== undefined) updateData.logo = logo;
    if (banner !== undefined) updateData.banner = banner;

    const updatedShop = await Shop.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      message: "Shop updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update shop", error: error.message });
  }
};

export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const productCount = await Product.countDocuments({ shop: id });
    if (productCount > 0) {
      return res.status(400).json({
        message: "Cannot delete shop with existing products",
        productCount,
      });
    }

    await Shop.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user.id, { role: "user" });

    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete shop", error: error.message });
  }
};

export const getShopProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const shop = await Shop.findById(id);
    if (!shop || shop.status !== "approved") {
      return res.status(404).json({ message: "Shop not found" });
    }

    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const total = await Product.countDocuments({
      shop: id,
      isActive: true,
    });

    const products = await Product.find({
      shop: id,
      isActive: true,
    })
      .select("name price images rating stock description")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      shop,
      products,
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
      .json({ message: "Failed to get shop products", error: error.message });
  }
};

export const toggleFollowShop = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const shop = await Shop.findById(id);
    if (!shop || shop.status !== "approved") {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existingFollow = await Follower.findOne({
      user: userId,
      shop: id,
    });

    if (existingFollow) {
      await Follower.findByIdAndDelete(existingFollow._id);
      res.json({ message: "Unfollowed shop successfully", following: false });
    } else {
      const newFollow = new Follower({
        user: userId,
        shop: id,
      });
      await newFollow.save();
      res.json({ message: "Followed shop successfully", following: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to toggle follow", error: error.message });
  }
};
