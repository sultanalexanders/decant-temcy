import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";
import "./Payment.css";

const SHIPPING_COST = 10000;

export default function Payment() {
  const { items, totalItems } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState("transfer");

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const total = subtotal + SHIPPING_COST;

  const handlePay = () => {
    navigate("/success");
  };

  return (
    <div className="page-container payment-page">
      <h1>Pembayaran</h1>
      <p className="payment-subtitle">Pilih metode pembayaran yang kamu inginkan</p>

      <div className="payment-layout">
        <div>
          <div className="payment-section">
            <div className="payment-section-title">Metode Pembayaran</div>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="transfer"
                  name="payment"
                  checked={method === "transfer"}
                  onChange={() => setMethod("transfer")}
                />
                <label htmlFor="transfer">
                  <div className="payment-method-icon">TF</div>
                  <div className="payment-method-info">
                    <span className="payment-method-name">Transfer Bank</span>
                    <span className="payment-method-desc">BCA, BNI, BRI, Mandiri</span>
                  </div>
                  <div className="payment-method-check" />
                </label>
              </div>
              <div className="payment-method">
                <input
                  type="radio"
                  id="ewallet"
                  name="payment"
                  checked={method === "ewallet"}
                  onChange={() => setMethod("ewallet")}
                />
                <label htmlFor="ewallet">
                  <div className="payment-method-icon">EW</div>
                  <div className="payment-method-info">
                    <span className="payment-method-name">E-Wallet</span>
                    <span className="payment-method-desc">GoPay, OVO, DANA, ShopeePay</span>
                  </div>
                  <div className="payment-method-check" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-summary">
          <h2>Rincian Pembayaran</h2>
          <div className="payment-summary-rows">
            <div className="payment-summary-row">
              <span className="label">Total Item</span>
              <span className="value">{totalItems} produk</span>
            </div>
            <div className="payment-summary-row">
              <span className="label">Subtotal</span>
              <span className="value">{formatRupiah(subtotal)}</span>
            </div>
            <div className="payment-summary-row">
              <span className="label">Ongkos Kirim</span>
              <span className="value">{formatRupiah(SHIPPING_COST)}</span>
            </div>
          </div>
          <div className="payment-summary-divider" />
          <div className="payment-summary-total">
            <span className="label">Total Pembayaran</span>
            <span className="value">{formatRupiah(total)}</span>
          </div>
          <div className="payment-nav">
            <button className="btn-outline" onClick={() => navigate("/shipping")}>
              <ArrowLeft size={16} /> Kembali
            </button>
            <button className="btn-primary" onClick={handlePay}>
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
