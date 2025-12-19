import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hey! We matched 👋", isMe: false },
    { text: "Nice! What are you working on?", isMe: true },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: input, isMe: true },
    ]);
    setInput("");
  };

  return (
    <div className="relative min-h-screen text-white px-6 py-8 flex justify-center items-center">
      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-4xl h-[85vh] rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
            A
          </div>

          <div className="flex flex-col">
            <span className="font-heading text-lg">Aarav</span>
            <span className="text-xs text-green-400">online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed ${
                  msg.isMe
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 rounded-br-sm"
                    : "bg-white/10 rounded-bl-sm"
                }`}
              >``
                {msg.text}
              </div>
            </div>
          ))}
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
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-medium hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
