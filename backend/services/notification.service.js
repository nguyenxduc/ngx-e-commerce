import Notification from "../models/notification.model.js";
import Follower from "../models/follower.model.js";
import Shop from "../models/shop.model.js";

export const notifyShopFollowers = async (shopId, productId, productName) => {
  try {
    const followers = await Follower.find({
      shop: shopId,
      notificationsEnabled: true,
    }).populate("user", "name email");

    if (followers.length === 0) {
      return;
    }

    const shop = await Shop.findById(shopId).select("name");
    if (!shop) {
      return;
    }

    const notifications = followers.map((follow) => ({
      user: follow.user._id,
      title: "Sản phẩm mới từ shop bạn theo dõi",
      message: `Shop ${shop.name} vừa thêm sản phẩm mới: ${productName}`,
      type: "new_product",
      data: {
        shopId: shopId,
        productId: productId,
      },
    }));

    await Notification.insertMany(notifications);

    console.log(`Sent ${notifications.length} notifications for new product`);
  } catch (error) {
    console.error("Error sending shop follower notifications:", error);
  }
};

export const notifyShopFollowersUpdate = async (
  shopId,
  updateTitle,
  updateMessage
) => {
  try {
    const followers = await Follower.find({
      shop: shopId,
      notificationsEnabled: true,
    }).populate("user", "name email");

    if (followers.length === 0) {
      return;
    }

    const shop = await Shop.findById(shopId).select("name");
    if (!shop) {
      return;
    }

    const notifications = followers.map((follow) => ({
      user: follow.user._id,
      title: "Cập nhật từ shop bạn theo dõi",
      message: `${updateTitle}: ${updateMessage}`,
      type: "shop_update",
      data: {
        shopId: shopId,
      },
    }));

    await Notification.insertMany(notifications);

    console.log(`Sent ${notifications.length} update notifications`);
  } catch (error) {
    console.error("Error sending update notifications:", error);
  }
};
