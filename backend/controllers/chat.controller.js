import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get chat", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: userId,
      content,
      attachments,
    });

    res.json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId, isActive: true });
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get messages", error: error.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({
      $or: [{ customer: userId }, { shop: userId }],
      isActive: true,
    });
    res.json(chats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get chats", error: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isActive) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await Message.updateMany({ chat: chatId }, { isActive: false });
    await Chat.findByIdAndUpdate(chatId, { isActive: false });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete chat", error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message || !message.isActive) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Message.findByIdAndUpdate(messageId, { isActive: false });
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete message", error: error.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { content } = req.body;
    const message = await Message.findById(messageId);
    if (!message || !message.isActive) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.content = content;
    await message.save();
    res.json({ message: "Message updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update message", error: error.message });
  }
};
