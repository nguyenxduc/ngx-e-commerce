export interface Message {
  _id: string;
  sender:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  content: string;
  messageType: "text" | "image" | "file";
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateChatRequest {
  participantId: string;
}

export interface CreateChatResponse {
  message: string;
  chat: Chat;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  messageType?: "text" | "image" | "file";
}

export interface SendMessageResponse {
  message: string;
  newMessage: Message;
}

export interface GetChatsRequest {
  page?: number;
  limit?: number;
}

export interface GetChatsResponse {
  chats: Chat[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalChats: number;
    limit: number;
  };
}

export interface GetChatMessagesRequest {
  chatId: string;
  page?: number;
  limit?: number;
}

export interface GetChatMessagesResponse {
  messages: Message[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    limit: number;
  };
}

export interface MarkAsReadRequest {
  chatId: string;
  messageId?: string;
}

export interface MarkAsReadResponse {
  message: string;
}

export interface DeleteChatRequest {
  chatId: string;
}

export interface DeleteChatResponse {
  message: string;
}

export interface ChatErrorResponse {
  message: string;
  error?: string;
}
