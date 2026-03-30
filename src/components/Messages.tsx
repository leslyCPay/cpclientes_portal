import { useState, useEffect } from "react";
import { Send, User, Mail, Clock } from "lucide-react";
import BASE_URL from "../config";
import { useParams } from "react-router-dom";
import axios from "axios";

interface MessagesProps {}

interface Message {
  id: string;
  sender: string;
  senderType: "client" | "rep";
  content: string;
  timestamp: string;
}

const getSenderColor = (sender: string, isSystem: boolean) => {
  if (isSystem)
    return "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-transparent";

  const colors = [
    "bg-blue-50 border-blue-200 text-blue-900",
    "bg-purple-50 border-purple-200 text-purple-900",
    "bg-green-50 border-green-200 text-green-900",
    "bg-rose-50 border-rose-200 text-rose-900",
    "bg-teal-50 border-teal-200 text-teal-900",
  ];

  const index =
    sender.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

const getSenderBadgeColor = (sender: string) => {
  const colors = [
    "text-blue-700",
    "text-purple-700",
    "text-green-700",
    "text-rose-700",
    "text-teal-700",
  ];
  const index =
    sender.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

export function Messages({}: MessagesProps) {
  const { caseId } = useParams<{ caseId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchCaseMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/messaging?case_id=${caseId ?? "PDC22-109766"}`,
        );

        const mapped: Message[] = response.data.map(
          (
            item: { created_by: string; message: string; created_at: string },
            index: number,
          ) => ({
            id: String(index),
            sender: item.created_by,
            senderType: item.created_by === "System" ? "client" : "rep",
            content: item.message,
            timestamp: item.created_at,
          }),
        );

        setMessages(mapped);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchCaseMessages();
  }, [caseId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "System",
      senderType: "client",
      content: newMessage,
      timestamp: new Date().toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    try {
      setIsSending(true);
      await axios.post(`${BASE_URL}/api/save-messages`, {
        case_id: caseId,
        message: newMessage,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Customer Service Rep Info */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-3">
            <User className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-black font-semibold text-lg">
              Customer Service Representative
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-black/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@lawfirm.com</span>
              </div>
              <div className="flex items-center gap-2 text-black/80">
                <span className="text-sm">Case: {caseId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-lg p-6">
        {messages.map((message) => {
          const isSystem =
            message.sender === "System" || message.sender === "---";
          const bubbleColor = getSenderColor(message.sender, isSystem);

          return (
            <div
              key={message.id}
              className={`flex ${isSystem ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 border ${bubbleColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`font-semibold text-sm ${
                      isSystem
                        ? "text-black"
                        : getSenderBadgeColor(message.sender)
                    }`}
                  >
                    {message.sender}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      isSystem ? "text-black/70" : "text-gray-400"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {message.timestamp}
                  </div>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message to the Customer Service Rep..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={isSending}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2 self-end disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        Messages are sent directly to our Customer Service team and you will
        receive a response within 24-48 hours.
      </div>
    </div>
  );
}
