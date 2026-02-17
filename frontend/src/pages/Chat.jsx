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

      try {
        const newMessage = await chatAPI.sendMessage(matchId, messageText);
        setMessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);
        setInput(messageText); 
      }
    }
  };

  const isMyMessage = (msg) => {
    const myUserId = profile?.user?.id;
    const myProfileId = profile?.id;
    

    if (msg.sender?.id === myUserId) return true;
    
    if (msg.sender_profile_id === myProfileId) return true;
    if (msg.sender?.id === myProfileId) return true;
    if (msg.sender === myProfileId) return true;
    
    if (msg.sender?.user?.id === myUserId) return true;
    
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen text-[#1A1A1A] flex items-center justify-center">
        <div className="text-lg text-[#6B6B6B] font-body">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1A1A1A] px-8 md:px-16 py-16 flex justify-center items-center">
      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-3xl h-[85vh] bento-card overflow-hidden">
        
        <div className="flex items-center gap-4 px-6 py-5 border-b border-[#E0D8CD]">
          <button 
            onClick={() => navigate("/matches")}
            className="text-[#6B6B6B] hover:text-[#1A1A1A] transition font-body text-sm"
          >
            ← Back
          </button>
          
          <div className="w-10 h-10 rounded-full bg-[#E8734A] flex items-center justify-center font-bold text-base text-white">
            {otherUser?.user?.first_name?.[0] || "?"}
          </div>

          <div className="flex flex-col">
            <span className="font-heading text-base font-semibold text-[#1A1A1A]">
              {otherUser?.user?.first_name || "Unknown"} {otherUser?.user?.last_name?.[0] || ""}.
            </span>
            <span className={`text-xs font-body ${connected ? "text-[#7BAF6E]" : "text-[#9A9A9A]"}`}>
              {connected ? "online" : "offline"}
            </span>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 space-y-3 overflow-y-auto bg-[#F5F2ED]">
          {messages.length === 0 ? (
            <div className="text-center text-[#9A9A9A] mt-10 font-body">
              <p>No messages yet.</p>
              <p className="text-sm mt-2">Say hello to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex ${isMyMessage(msg) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed font-body ${
                    isMyMessage(msg)
                      ? "bg-[#1A1A1A] text-white rounded-2xl rounded-br-md"
                      : "bg-white border border-[#E0D8CD] text-[#1A1A1A] rounded-2xl rounded-bl-md"
                  }`}
                >
                  {msg.message}
                  <div className={`text-xs mt-1 ${isMyMessage(msg) ? "text-white/50" : "text-[#9A9A9A]"}`}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-5 py-5 border-t border-[#E0D8CD] flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message\u2026"
            className="clean-input flex-1"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="btn-dark px-5 py-2.5 text-sm disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
