import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "./ChatbotWidget.css";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const INITIAL_MESSAGE: Message = {
  id: 0,
  text: "Halo! Saya asisten Decant Temcy. Ketik \"rekomendasi\" untuk mendapat saran parfum.",
  sender: "bot",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();

  if (lower.includes("rekomendasi") || lower.includes("rekomendasi:") || lower.includes("rekomend")) {
    return "Berdasarkan preferensi, kami merekomendasikan: Above The Cloud (HMNS) atau Turathi Electric (Afnan).";
  }
  if (lower.includes("harga") || lower.includes("berapa")) {
    return "Harga decant kami mulai dari Rp 9.400 untuk ukuran 1ml. Tersedia dalam ukuran 1ml, 2ml, 3ml, dan 5ml.";
  }
  if (lower.includes("pengiriman") || lower.includes("ongkir") || lower.includes("kirim")) {
    return "Ongkos kirim flat Rp 10.000 ke seluruh Indonesia. Estimasi pengiriman 2-5 hari kerja.";
  }
  if (lower.includes("halo") || lower.includes("hai") || lower.includes("hi")) {
    return "Halo! Ada yang bisa saya bantu? Coba tanyakan tentang rekomendasi parfum, harga, atau pengiriman.";
  }
  if (lower.includes("terima kasih") || lower.includes("makasih")) {
    return "Sama-sama! Senang bisa membantu. Selamat berbelanja di Decant Temcy!";
  }
  return "Maaf, saya belum bisa memahami pertanyaan itu. Coba tanyakan tentang rekomendasi parfum, harga, atau pengiriman.";
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), text, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: Message = { id: Date.now() + 1, text: reply, sender: "bot" };
      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">DT</div>
              <div className="chatbot-header-text">
                <h3>Decant Temcy</h3>
                <span>Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="chatbot-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chatbot-send" onClick={sendMessage} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button className={`chatbot-toggle ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
