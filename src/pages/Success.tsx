import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Success.css";

function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DTC-${num}`;
}

export default function Success() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const orderId = generateOrderId();

  const handleBack = () => {
    clearCart();
    navigate("/");
  };

  return (
    <div className="page-container success-page">
      <div className="success-card">
        <div className="success-icon">
          <Check size={32} strokeWidth={2.5} />
        </div>
        <h1>Pembayaran Berhasil</h1>
        <p className="success-message">
          Terima kasih! Pesanan kamu sedang diproses dan akan segera dikirim.
        </p>
        <div className="success-order-id">
          <span className="label">Nomor Pesanan</span>
          <span className="id">{orderId}</span>
        </div>
        <button className="btn-primary" onClick={handleBack}>
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
