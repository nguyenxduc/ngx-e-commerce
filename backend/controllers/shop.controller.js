import Shop from "../models/shop.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Follower from "../models/follower.model.js";

export const createShop = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, logo, banner } = req.body;

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
      logo,
      banner,
      ownerId: userId,
    });

    await shop.save();

    await User.findByIdAndUpdate(userId, {
      role: "seller",
      shop: shop._id,
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
    const search = req.query.search;
    const query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const shops = await Shop.find(query)
      .populate({
        path: "ownerId",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.json(shops);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get shops", error: error.message });
  }
};

export const getPendingShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true })
      .populate({
        path: "ownerId",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.json(shops);
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

    shop.isActive = true;
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

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.isActive = false;
    await shop.save();

    await User.findByIdAndUpdate(shop.ownerId, { role: "user" });

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

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.isActive) {
      return res.status(400).json({ message: "Shop is already suspended" });
    }

    shop.isActive = false;
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

    if (shop.isActive) {
      return res.status(400).json({ message: "Shop is already active" });
    }

    shop.isActive = true;
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
      path: "ownerId",
      select: "name email",
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.isActive) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const productCount = await Product.countDocuments({
      shop: id,
      isActive: true,
    });

    const followerCount = await Follower.countDocuments({ shop: id });

    res.json({
      ...shop.toObject(),
      productCount,
      followerCount,
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
    const { name, description, logo, banner } = req.body;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
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

    const productCount = await Product.countDocuments({ shop: id });
    if (productCount > 0) {
      return res.status(400).json({
        message: "Cannot delete shop with existing products",
      });
    }

    await Shop.findByIdAndUpdate(id, { isActive: false });
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
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const shop = await Shop.findById(id);
    if (!shop || !shop.isActive) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const products = await Product.find({
      shop: id,
      isActive: true,
    })
      .select("name price images rating stock description")
      .sort(sortOptions);

    res.json({ shop, products });
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
    if (!shop || !shop.isActive) {
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
