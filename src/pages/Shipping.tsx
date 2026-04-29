import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";
import "./Shipping.css";

export default function Shipping() {
  const { items, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nama penerima wajib diisi";
    if (!address.trim()) errs.address = "Alamat lengkap wajib diisi";
    if (!phone.trim()) errs.phone = "Nomor telepon wajib diisi";
    else if (!/^[0-9+\-\s]{8,15}$/.test(phone.trim()))
      errs.phone = "Nomor telepon tidak valid";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      navigate("/payment");
    }
  };

  return (
    <div className="page-container shipping-page">
      <h1>Pengiriman</h1>
      <p className="shipping-subtitle">Lengkapi alamat pengiriman kamu</p>

      <div className="shipping-layout">
        <form className="shipping-form" onSubmit={handleSubmit}>
          <div className="shipping-field">
            <label>Nama Penerima</label>
            <input
              type="text"
              placeholder="Masukkan nama penerima"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="shipping-error">{errors.name}</span>}
          </div>

          <div className="shipping-field">
            <label>Alamat Lengkap</label>
            <textarea
              placeholder="Jl. Contoh No. 123, Kota, Kode Pos"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <span className="shipping-error">{errors.address}</span>}
          </div>

          <div className="shipping-field">
            <label>Nomor Telepon</label>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <span className="shipping-error">{errors.phone}</span>}
          </div>

          <div className="shipping-nav">
            <button type="button" className="btn-outline" onClick={() => navigate("/cart")}>
              <ArrowLeft size={16} /> Kembali
            </button>
            <button type="submit" className="btn-primary">
              Lanjut ke Pembayaran
            </button>
          </div>
        </form>

        <div className="shipping-summary">
          <h2>Ringkasan Pesanan</h2>
          <div className="shipping-summary-items">
            {items.map((item) => (
              <div
                className="shipping-summary-item"
                key={`${item.product.product_id}-${item.sizeKey}`}
              >
                <span className="name">
                  {item.product.product_name} ({item.sizeLabel}) x{item.quantity}
                </span>
                <span className="price">
                  {formatRupiah(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="shipping-summary-divider" />
          <div className="shipping-summary-row">
            <span className="label">Total Item</span>
            <span className="value">{totalItems} produk</span>
          </div>
          <div className="shipping-summary-row">
            <span className="label">Subtotal</span>
            <span className="value">{formatRupiah(subtotal)}</span>
          </div>
          <div className="shipping-summary-divider" />
          <div className="shipping-summary-total">
            <span className="label">Total</span>
            <span className="value">{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
