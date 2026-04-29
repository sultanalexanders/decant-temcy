import { MessageCircle } from "lucide-react";
import "./Chatbot.css";

export default function Chatbot() {
  return (
    <div className="page-container chatbot-page">
      <MessageCircle size={48} color="var(--text-muted)" strokeWidth={1.5} />
      <h2>Chatbot Parfum</h2>
      <p>Fitur chatbot sedang dalam pengembangan. Nanti kamu bisa tanya rekomendasi parfum di sini.</p>
    </div>
  );
}
