import axiosClient from "../lib/axios";
import type { SendMessageRequest, UpdateMessageRequest } from "../types";

export const chatApi = {
  getChat: async (chatId: string) => {
    const response = await axiosClient.get(`/chat/${chatId}`);
    return response.data;
  },

  getUserChats: async () => {
    const response = await axiosClient.get("/chat");
    return response.data;
  },

  getMessages: async (chatId: string) => {
    const response = await axiosClient.get(`/chat/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId: string, data: SendMessageRequest) => {
    const response = await axiosClient.post(`/chat/${chatId}/messages`, data);
    return response.data;
  },

  updateMessage: async (
    chatId: string,
    messageId: string,
    data: UpdateMessageRequest
  ) => {
    const response = await axiosClient.put(
      `/chat/${chatId}/messages/${messageId}`,
      data
    );
    return response.data;
  },

  deleteMessage: async (chatId: string, messageId: string) => {
    const response = await axiosClient.delete(
      `/chat/${chatId}/messages/${messageId}`
    );
    return response.data;
  },

  deleteChat: async (chatId: string) => {
    const response = await axiosClient.delete(`/chat/${chatId}`);
    return response.data;
  },
};
