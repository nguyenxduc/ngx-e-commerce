import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["customer", "shop"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "order", "product"],
      default: "text",
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "file"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        filename: String,
        size: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ read: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
