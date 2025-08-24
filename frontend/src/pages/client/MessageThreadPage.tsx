import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/client";

interface Sender {
  _id: string;
  name: string;
  avatar?: string;
}

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  sender: Sender;
  senderType: "customer" | "shop";
}

const MessageThreadPage: React.FC = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        setLoading(true);
        const res = await apiClient.get(`/chat/${chatId}/messages`);
        setMessages(res.data.messages || []);
        await apiClient.patch(`/chat/${chatId}/read`);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !chatId) return;
    try {
      const res = await apiClient.post(`/chat/${chatId}/messages`, {
        content: input.trim(),
      });
      setMessages((prev) => [...prev, res.data.message]);
      setInput("");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 h-[60vh] overflow-y-auto">
            {loading && <div>Đang tải...</div>}
            {error && (
              <div className="alert alert-error text-sm mb-4">{error}</div>
            )}
            {messages.map((m) => (
              <div key={m._id} className="mb-3">
                <div className="text-xs text-gray-500 mb-1">
                  {m.sender?.name}
                </div>
                <div
                  className={
                    m.senderType === "customer"
                      ? "bg-blue-50 text-gray-900 p-3 rounded-lg inline-block"
                      : "bg-gray-100 text-gray-900 p-3 rounded-lg inline-block"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              className="input input-bordered flex-1"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary" onClick={send}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThreadPage;
