import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Find chat
    const chat = await Chat.findById(chatId)
      .populate("customer", "name avatar")
      .populate("shop", "name logo")
      .populate("lastMessage");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is part of this chat
    if (
      chat.customer._id.toString() !== userId &&
      chat.shop._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get recent messages
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      chat,
      messages: messages.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get chat",
      error: error.message,
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = "text", attachments = [] } = req.body;
    const senderId = req.user.id;

    // Find chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is part of this chat
    if (
      chat.customer.toString() !== senderId &&
      chat.shop.toString() !== senderId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Determine sender type
    const senderType =
      chat.customer.toString() === senderId ? "customer" : "shop";

    // Create message
    const message = new Message({
      chat: chatId,
      sender: senderId,
      senderType,
      content,
      messageType,
      attachments,
    });

    await message.save();

    // Update chat
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();

    // Update unread count for the other party
    if (senderType === "customer") {
      chat.shopUnreadCount += 1;
    } else {
      chat.customerUnreadCount += 1;
    }

    await chat.save();

    // Populate sender info for response
    await message.populate("sender", "name avatar");

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Find chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is part of this chat
    if (
      chat.customer.toString() !== userId &&
      chat.shop.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chat: chatId });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get messages",
      error: error.message,
    });
  }
};

// Mark messages as read

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const chats = await Chat.find({
      $or: [{ customer: userId }, { shop: userId }],
    })
      .populate("customer", "name avatar")
      .populate("shop", "name logo")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Chat.countDocuments({
      $or: [{ customer: userId }, { shop: userId }],
    });

    res.json({
      data: chats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get chats",
      error: error.message,
    });
  }
};

// Delete chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Find chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is part of this chat
    if (
      chat.customer.toString() !== userId &&
      chat.shop.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Chat.aggregate([
      {
        $match: {
          $or: [{ customer: userId }, { shop: userId }],
        },
      },
      {
        $group: {
          _id: null,
          totalUnread: {
            $sum: {
              $cond: [
                { $eq: ["$customer", userId] },
                "$customerUnreadCount",
                "$shopUnreadCount",
              ],
            },
          },
        },
      },
    ]);

    res.json({
      unreadCount: unreadCount[0]?.totalUnread || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};
