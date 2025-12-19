import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { chatAPI, matchesAPI, createChatWebSocket } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matchId = searchParams.get("matchId");
  const { profile } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Load chat data and connect to WebSocket
  useEffect(() => {
    if (!matchId) {
      navigate("/matches");
      return;
    }

    loadChatData();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [matchId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatData = async () => {
    try {
      const [messagesData, otherUserData] = await Promise.all([
        chatAPI.getMessages(matchId),
        matchesAPI.getOtherUser(matchId),
      ]);
      
      setMessages(messagesData || []);
      setOtherUser(otherUserData);
    } catch (error) {
      console.error("Failed to load chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const handleMessage = (data) => {
      console.log("WebSocket message received:", data);
      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message_id,
            message: data.message,
            sender: { id: data.sender_id },
            sender_profile_id: data.sender_profile_id,
            sender_name: data.sender_name,
            created_at: data.created_at,
          },
        ]);
      } else if (data.type === "connection_established") {
        setConnected(true);
        console.log("WebSocket connected");
      } else if (data.type === "error") {
        console.error("WebSocket error:", data.message);
      }
    };

    const handleError = (error) => {
      console.error("WebSocket connection error:", error);
      setConnected(false);
    };

    wsRef.current = createChatWebSocket(matchId, handleMessage, handleError);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");

    // Try WebSocket first
    if (wsRef.current && connected) {
      wsRef.current.send(messageText);
    } else {
      // Fallback to HTTP
      try {
        const newMessage = await chatAPI.sendMessage(matchId, messageText);
        setMessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);
        setInput(messageText); // Restore input if failed
      }
    }
  };

  const isMyMessage = (msg) => {
    const myUserId = profile?.user?.id;
    const myProfileId = profile?.id;
    
    // Check against user ID (from WebSocket)
    if (msg.sender?.id === myUserId) return true;
    
    // Check against profile ID (from HTTP API)
    if (msg.sender_profile_id === myProfileId) return true;
    if (msg.sender?.id === myProfileId) return true;
    if (msg.sender === myProfileId) return true;
    
    // Check nested user object (from HTTP API)
    if (msg.sender?.user?.id === myUserId) return true;
    
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white px-6 py-8 flex justify-center items-center">
      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-4xl h-[85vh] rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
          <button 
            onClick={() => navigate("/matches")}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>
          
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
            {otherUser?.user?.first_name?.[0] || "?"}
          </div>

          <div className="flex flex-col">
            <span className="font-heading text-lg">
              {otherUser?.user?.first_name || "Unknown"} {otherUser?.user?.last_name?.[0] || ""}.
            </span>
            <span className={`text-xs ${connected ? "text-green-400" : "text-gray-500"}`}>
              {connected ? "online" : "offline"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>No messages yet.</p>
              <p className="text-sm mt-2">Say hello to start the conversation! 👋</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex ${isMyMessage(msg) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed ${
                    isMyMessage(msg)
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 rounded-br-sm"
                      : "bg-white/10 rounded-bl-sm"
                  }`}
                >
                  {msg.message}
                  <div className={`text-xs mt-1 ${isMyMessage(msg) ? "text-white/60" : "text-gray-500"}`}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3 bg-black/30">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message…"
            className="flex-1 bg-black/50 text-[15px] px-5 py-3 rounded-xl outline-none border border-white/10 focus:border-purple-500 transition"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
