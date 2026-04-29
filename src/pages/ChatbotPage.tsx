import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, Send, Trash2 } from "lucide-react";
import "./ChatbotPage.css";

type Sender = "bot" | "user";

interface Message {
  id: number;
  sender: Sender;
  text: string;
}

interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const CHAT_HISTORY_KEY = "decant-temcy-chat-history";

const INITIAL_BOT_MESSAGE: Message = {
  id: 1,
  sender: "bot",
  text: "Halo! Saya asisten Decant Temcy. Ceritakan preferensi aromamu, nanti saya bantu rekomendasi.",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();

  if (lower.includes("rekomendasi") || lower.includes("recommend")) {
    return "Untuk karakter versatile, coba Above The Cloud (HMNS). Jika mau lebih fresh-sweet, Turathi Electric juga cocok.";
  }
  if (lower.includes("floral")) return "Jika kamu suka floral, cari profil jasmine atau rose agar kesan lebih elegan.";
  if (lower.includes("woody")) return "Untuk woody, kamu bisa fokus ke cedarwood atau sandalwood untuk kesan hangat.";
  if (lower.includes("citrus")) return "Citrus cocok untuk harian karena terasa segar dan clean.";
  if (lower.includes("harga")) return "Harga decant mulai dari Rp9.400 untuk 1ml, tersedia sampai 5ml.";
  if (lower.includes("pengiriman") || lower.includes("ongkir")) {
    return "Ongkir flat Rp10.000, estimasi pengiriman 2-5 hari kerja.";
  }
  if (lower.includes("halo") || lower.includes("hai") || lower.includes("hi")) {
    return "Halo! Tulis 'rekomendasi' atau sebut preferensi aroma favoritmu ya.";
  }
  return "Terima kasih. Kamu bisa ketik 'rekomendasi', atau jelaskan aroma yang kamu suka seperti floral, woody, atau citrus.";
}

function buildEmptySession(): ChatSession {
  const now = new Date().toISOString();
  return {
    id: Date.now(),
    title: "Chat Baru",
    createdAt: now,
    updatedAt: now,
    messages: [INITIAL_BOT_MESSAGE],
  };
}

export default function ChatbotPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!raw) {
        const initial = buildEmptySession();
        setSessions([initial]);
        setActiveSessionId(initial.id);
        return;
      }
      const parsed = JSON.parse(raw) as ChatSession[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const initial = buildEmptySession();
        setSessions([initial]);
        setActiveSessionId(initial.id);
        return;
      }
      const sorted = parsed.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setSessions(sorted);
      setActiveSessionId(sorted[0].id);
    } catch {
      const initial = buildEmptySession();
      setSessions([initial]);
      setActiveSessionId(initial.id);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const createNewSession = () => {
    const newSession = buildEmptySession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
  };

  const deleteSession = (sessionId: number) => {
    setSessions((prev) => {
      const next = prev.filter((session) => session.id !== sessionId);
      if (next.length === 0) {
        const fallback = buildEmptySession();
        setActiveSessionId(fallback.id);
        return [fallback];
      }
      if (sessionId === activeSessionId) {
        setActiveSessionId(next[0].id);
      }
      return next;
    });
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!activeSession || !input.trim()) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: userText,
    };
    const sessionTitle = userText.length > 28 ? `${userText.slice(0, 28)}...` : userText;

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSession.id
          ? {
              ...session,
              title: session.title === "Chat Baru" ? sessionTitle : session.title,
              updatedAt: new Date().toISOString(),
              messages: [...session.messages, userMessage],
            }
          : session
      )
    );
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: getBotReply(userText),
      };
      setTyping(false);
      setSessions((prev) =>
        prev
          .map((session) =>
            session.id === activeSession.id
              ? {
                  ...session,
                  updatedAt: new Date().toISOString(),
                  messages: [...session.messages, botMessage],
                }
              : session
          )
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    }, 700);
  };

  return (
    <div className="page-container chatbot-full-page">
      <div className="chatbot-full-layout">
        <aside className="chatbot-history-sidebar">
          <div className="chatbot-history-head">
            <h2>Riwayat Chat</h2>
            <button className="chatbot-new-btn" type="button" onClick={createNewSession}>
              <Plus size={16} /> Chat Baru
            </button>
          </div>

          <div className="chatbot-history-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`chatbot-history-item ${session.id === activeSessionId ? "active" : ""}`}
              >
                <button type="button" onClick={() => setActiveSessionId(session.id)}>
                  <span className="title">{session.title}</span>
                  <span className="time">
                    {new Date(session.updatedAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </button>
                <button
                  type="button"
                  className="chatbot-history-delete"
                  title="Hapus riwayat chat"
                  aria-label="Hapus riwayat chat"
                  onClick={() => deleteSession(session.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <section className="chatbot-main-area">
          <div className="chatbot-main-header">
            <MessageCircle size={18} />
            <h3>Asisten Decant Temcy</h3>
          </div>

          <div className="chatbot-main-messages">
            {activeSession?.messages.map((message) => (
              <div key={message.id} className={`chatbot-main-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {typing && (
              <div className="chatbot-main-typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form className="chatbot-main-input" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Ketik pesan kamu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              title="Kirim pesan"
              aria-label="Kirim pesan"
              disabled={!input.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
