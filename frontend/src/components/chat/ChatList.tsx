import React, { useState, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { chatService } from "../../api/chat.service";
import { useAuthStore } from "../../stores/auth.store";
import type { ChatUpdate } from "../../api/socket.service";

interface Chat {
  _id: string;
  customer: {
    _id: string;
    name: string;
    avatar: string;
  };
  shop: {
    _id: string;
    name: string;
    avatar: string;
  };
  lastMessage?: {
    _id: string;
    content: string;
    createdAt: string;
  };
  lastMessageAt: string;
  customerUnreadCount: number;
  shopUnreadCount: number;
  isActive: boolean;
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect, selectedChatId }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const { socketService } = useChat({ autoConnect: true });

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  // Listen for chat updates
  useEffect(() => {
    const handleChatUpdate = (chatUpdate: ChatUpdate) => {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === chatUpdate._id 
            ? { 
                ...chat, 
                customerUnreadCount: chatUpdate.customerUnreadCount,
                shopUnreadCount: chatUpdate.shopUnreadCount,
                lastMessageAt: chatUpdate.lastMessageAt || chat.lastMessageAt
              }
            : chat
        )
      );
    };

    socketService.onChatUpdate(handleChatUpdate);

    return () => {
      socketService.removeChatUpdateHandler(handleChatUpdate);
    };
  }, [socketService]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await chatService.getUserChats();
      setChats(response.data);
    } catch (err) {
      setError("Failed to load chats");
      console.error("Error loading chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUnreadCount = (chat: Chat) => {
    if (user?.role === "seller") {
      return chat.shopUnreadCount;
    }
    return chat.customerUnreadCount;
  };

  const getChatName = (chat: Chat) => {
    if (user?.role === "seller") {
      return chat.customer.name;
    }
    return chat.shop.name;
  };

  const getChatAvatar = (chat: Chat) => {
    if (user?.role === "seller") {
      return chat.customer.avatar;
    }
    return chat.shop.avatar;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={loadChats}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>No chats yet</p>
        <p className="text-sm">Start a conversation with a shop or customer</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const unreadCount = getUnreadCount(chat);
        const isSelected = selectedChatId === chat._id;
        
        return (
          <div
            key={chat._id}
            onClick={() => onChatSelect(chat._id)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              isSelected
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {getChatAvatar(chat) ? (
                  <img
                    src={getChatAvatar(chat)}
                    alt={getChatName(chat)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* Chat info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 truncate">
                  {getChatName(chat)}
                </h4>
                <span className="text-xs text-gray-500">
                  {formatTime(chat.lastMessageAt)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage 
                    ? truncateText(chat.lastMessage.content)
                    : "No messages yet"
                  }
                </p>
                {unreadCount > 0 && (
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
