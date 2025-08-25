import type { BaseEntity } from "./common.types";

export type Message = BaseEntity & {
  chat: string;
  sender: string;
  content: string;
  attachments?: string[];
  isActive: boolean;
};

export type MessageWithSender = Omit<Message, "sender"> & {
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
};

export type Chat = BaseEntity & {
  customer: string;
  shop: string;
  isActive: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
};

export type ChatWithParticipants = Omit<Chat, "customer" | "shop"> & {
  customer: {
    _id: string;
    name: string;
    avatar: string;
  };
  shop: {
    _id: string;
    name: string;
    logo: string;
  };
};

export type SendMessageRequest = {
  content: string;
  attachments?: string[];
};

export type UpdateMessageRequest = {
  content: string;
};
