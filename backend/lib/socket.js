import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    // Join user to their personal room
    socket.join(`user_${socket.user._id}`);

    // Handle joining chat room
    socket.on("join_chat", async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Check if user is part of this chat
        if (
          chat.customer.toString() !== socket.user._id.toString() &&
          chat.shop.toString() !== socket.user._id.toString()
        ) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        socket.join(`chat_${chatId}`);
        socket.emit("joined_chat", { chatId });

        // Mark messages as read
        await markMessagesAsRead(chatId, socket.user._id);

        console.log(`User ${socket.user.name} joined chat ${chatId}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Handle leaving chat room
    socket.on("leave_chat", (chatId) => {
      socket.leave(`chat_${chatId}`);
      socket.emit("left_chat", { chatId });
      console.log(`User ${socket.user.name} left chat ${chatId}`);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      try {
        const {
          chatId,
          content,
          messageType = "text",
          attachments = [],
        } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Check if user is part of this chat
        if (
          chat.customer.toString() !== socket.user._id.toString() &&
          chat.shop.toString() !== socket.user._id.toString()
        ) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Determine sender type
        const senderType =
          chat.customer.toString() === socket.user._id.toString()
            ? "customer"
            : "shop";

        // Create message
        const message = new Message({
          chat: chatId,
          sender: socket.user._id,
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

        // Populate sender info
        await message.populate("sender", "name avatar");

        // Emit message to chat room
        const messageData = {
          _id: message._id,
          chat: message.chat,
          sender: message.sender,
          senderType: message.senderType,
          content: message.content,
          messageType: message.messageType,
          attachments: message.attachments,
          read: message.read,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        };

        io.to(`chat_${chatId}`).emit("new_message", messageData);

        // Emit chat update to both users
        const chatUpdate = {
          _id: chat._id,
          lastMessage: message._id,
          lastMessageAt: chat.lastMessageAt,
          customerUnreadCount: chat.customerUnreadCount,
          shopUnreadCount: chat.shopUnreadCount,
        };

        // Emit to customer
        io.to(`user_${chat.customer}`).emit("chat_updated", chatUpdate);

        // Emit to shop owner
        io.to(`user_${chat.shop}`).emit("chat_updated", chatUpdate);

        console.log(`Message sent in chat ${chatId} by ${socket.user.name}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
        console.error("Send message error:", error);
      }
    });

    // Handle typing indicator
    socket.on("typing_start", (chatId) => {
      socket.to(`chat_${chatId}`).emit("user_typing", {
        userId: socket.user._id,
        userName: socket.user.name,
        chatId,
      });
    });

    socket.on("typing_stop", (chatId) => {
      socket.to(`chat_${chatId}`).emit("user_stop_typing", {
        userId: socket.user._id,
        chatId,
      });
    });

    // Handle message read
    socket.on("mark_read", async (data) => {
      try {
        const { chatId, messageIds } = data;

        await Message.updateMany(
          {
            _id: { $in: messageIds },
            chat: chatId,
            sender: { $ne: socket.user._id },
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
          }
        );

        // Update chat unread count
        const chat = await Chat.findById(chatId);
        if (chat) {
          const senderType =
            chat.customer.toString() === socket.user._id.toString()
              ? "customer"
              : "shop";

          if (senderType === "customer") {
            chat.customerUnreadCount = 0;
          } else {
            chat.shopUnreadCount = 0;
          }

          await chat.save();

          // Emit updated chat to both users
          const chatUpdate = {
            _id: chat._id,
            customerUnreadCount: chat.customerUnreadCount,
            shopUnreadCount: chat.shopUnreadCount,
          };

          io.to(`user_${chat.customer}`).emit("chat_updated", chatUpdate);
          io.to(`user_${chat.shop}`).emit("chat_updated", chatUpdate);
        }

        socket.emit("messages_marked_read", { messageIds });
      } catch (error) {
        socket.emit("error", { message: "Failed to mark messages as read" });
      }
    });

    // Handle online status
    socket.on("set_online_status", async (status) => {
      try {
        await User.findByIdAndUpdate(socket.user._id, {
          onlineStatus: status,
          lastSeen: status === "online" ? new Date() : new Date(),
        });

        // Emit online status to all connected users
        io.emit("user_status_changed", {
          userId: socket.user._id,
          status,
          lastSeen: new Date(),
        });
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      try {
        // Update user's online status
        await User.findByIdAndUpdate(socket.user._id, {
          onlineStatus: "offline",
          lastSeen: new Date(),
        });

        // Emit offline status to all connected users
        io.emit("user_status_changed", {
          userId: socket.user._id,
          status: "offline",
          lastSeen: new Date(),
        });

        console.log(
          `User disconnected: ${socket.user.name} (${socket.user._id})`
        );
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  return io;
};

// Helper function to mark messages as read
const markMessagesAsRead = async (chatId, userId) => {
  try {
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    // Update chat unread count
    const chat = await Chat.findById(chatId);
    if (chat) {
      const senderType =
        chat.customer.toString() === userId.toString() ? "customer" : "shop";

      if (senderType === "customer") {
        chat.customerUnreadCount = 0;
      } else {
        chat.shopUnreadCount = 0;
      }

      await chat.save();
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

// Function to emit events from outside socket context
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

export const emitToChat = (chatId, event, data) => {
  if (io) {
    io.to(`chat_${chatId}`).emit(event, data);
  }
};

export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export default io;
