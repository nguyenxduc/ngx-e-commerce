import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/auth.store";
import ChatList from "../../components/chat/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";
import { chatService } from "../../api/chat.service";

const MessagesPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChatInfo, setSelectedChatInfo] = useState<{
    shopName?: string;
    customerName?: string;
  } | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    // Load chat info when selected chat changes
    if (selectedChatId) {
      loadChatInfo(selectedChatId);
    }
  }, [selectedChatId]);

  const loadChatInfo = async (chatId: string) => {
    try {
      const response = await chatService.getChat(chatId);
      const chat = response.data.chat;
      
      setSelectedChatInfo({
        shopName: chat.shop?.name,
        customerName: chat.customer?.name,
      });
    } catch (error) {
      console.error("Failed to load chat info:", error);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleCloseChat = () => {
    setSelectedChatId(null);
    setSelectedChatInfo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            Chat with shops and customers in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
              <ChatList
                onChatSelect={handleChatSelect}
                selectedChatId={selectedChatId || undefined}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            {selectedChatId ? (
              <ChatWindow
                chatId={selectedChatId}
                shopName={selectedChatInfo?.shopName}
                customerName={selectedChatInfo?.customerName}
                onClose={handleCloseChat}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
