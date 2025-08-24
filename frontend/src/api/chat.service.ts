import axiosClient from "../lib/axios";
import type {
  CreateChatRequest,
  CreateChatResponse,
  SendMessageRequest,
  SendMessageResponse,
  GetChatsRequest,
  GetChatsResponse,
  GetChatMessagesRequest,
  GetChatMessagesResponse,
  MarkAsReadResponse,
  DeleteChatResponse,
} from "../types";

export const chatService = {
  // Protected routes
  createChat: async (data: CreateChatRequest): Promise<CreateChatResponse> => {
    const response = await axiosClient.post("/chats", data);
    return response.data;
  },

  sendMessage: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    const response = await axiosClient.post("/chats/messages", data);
    return response.data;
  },

  getChats: async (params?: GetChatsRequest): Promise<GetChatsResponse> => {
    const response = await axiosClient.get("/chats", { params });
    return response.data;
  },

  getChatMessages: async (
    chatId: string,
    params?: Omit<GetChatMessagesRequest, "chatId">
  ): Promise<GetChatMessagesResponse> => {
    const response = await axiosClient.get(`/chats/${chatId}/messages`, {
      params,
    });
    return response.data;
  },

  markAsRead: async (
    chatId: string,
    messageId?: string
  ): Promise<MarkAsReadResponse> => {
    const response = await axiosClient.put(`/chats/${chatId}/read`, {
      messageId,
    });
    return response.data;
  },

  deleteChat: async (chatId: string): Promise<DeleteChatResponse> => {
    const response = await axiosClient.delete(`/chats/${chatId}`);
    return response.data;
  },
};
