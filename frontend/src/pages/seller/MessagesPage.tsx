import React, { useEffect, useState } from "react";
import apiClient from "../../api/client";

interface UserSummary {
  _id: string;
  name: string;
  avatar?: string;
}

interface MessageSummary {
  _id: string;
  content: string;
  createdAt: string;
}

interface ChatItem {
  _id: string;
  customer: UserSummary;
  lastMessage?: MessageSummary;
  lastMessageAt?: string;
  customerUnreadCount: number;
}

const SellerMessagesPage: React.FC = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/chat/seller/chats");
        setChats(data.chats || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Tin nhắn từ khách hàng</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow border">
        <ul className="divide-y">
          {chats.map((chat) => (
            <li key={chat._id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">
                      {chat.customer?.name || "Khách hàng"}
                    </p>
                    {chat.customerUnreadCount > 0 && (
                      <span className="text-xs text-white bg-blue-600 rounded-full px-2 py-0.5">
                        {chat.customerUnreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage?.content || "Bắt đầu trò chuyện"}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {chats.length === 0 && !loading && (
            <li className="p-6 text-center text-sm text-gray-600">
              Chưa có tin nhắn nào.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SellerMessagesPage;
