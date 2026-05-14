import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";
import "./Checkout.css";

const SHIPPING_COST = 10000;

type Step = 1 | 2 | 3;
type PaymentMethod = "transfer" | "ewallet" | "cod";

const COURIERS = [
  { id: "jne", name: "JNE", est: "2-3 hari kerja" },
  { id: "jnt", name: "J&T", est: "2-4 hari kerja" },
  { id: "sicepat", name: "SiCepat", est: "1-3 hari kerja" },
  { id: "anteraja", name: "AnterAja", est: "3-5 hari kerja" },
];

const STEP_LABELS = ["Pengiriman", "Pembayaran", "Konfirmasi"];

export default function Checkout() {
  const { items, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [paying, setPaying] = useState(false);

  // Step 1: Shipping
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [courier, setCourier] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2: Payment
  const [method, setMethod] = useState<PaymentMethod>("transfer");

  useEffect(() => {
    if (items.length === 0 && !paying) {
      navigate("/cart");
    }
  }, [items.length, paying, navigate]);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const total = subtotal + SHIPPING_COST;

  const selectedCourier = COURIERS.find((c) => c.id === courier);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nama penerima wajib diisi";
    if (!address.trim()) errs.address = "Alamat lengkap wajib diisi";
    if (!phone.trim()) errs.phone = "Nomor telepon wajib diisi";
    else if (!/^[0-9+\-\s]{8,15}$/.test(phone.trim()))
      errs.phone = "Nomor telepon tidak valid";
    if (!courier) errs.courier = "Pilih kurir pengiriman";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 3) setStep((step + 1) as Step);
  };

  const goBack = () => {
    if (step > 1) setStep((step - 1) as Step);
    else navigate("/cart");
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      clearCart();
      navigate("/success");
    }, 3000);
  };

  const paymentLabel =
    method === "transfer"
      ? "Transfer Bank"
      : method === "ewallet"
        ? "E-Wallet / QRIS"
        : "Bayar di Tempat (COD)";

  return (
    <div className="page-container checkout-page">
      <h1>Checkout</h1>
      <p className="checkout-subtitle">Selesaikan pembayaran dalam 3 langkah singkat</p>

      {/* ── Stepper ── */}
      <div className="checkout-stepper" role="list" aria-label="Tahapan checkout">
        {STEP_LABELS.map((label, i) => {
          const num = (i + 1) as Step;
          const isActive = step === num;
          const isDone = step > num;
          return (
            <div
              key={num}
              className={`checkout-stepper-item ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
              role="listitem"
            >
              <span className="checkout-stepper-index">
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  num
                )}
              </span>
              <span className="checkout-stepper-label">{label}</span>
              {i < STEP_LABELS.length - 1 && (
                <span className={`checkout-stepper-line ${isDone ? "done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Main layout ── */}
      <div className="checkout-layout">
        <div className="checkout-main-card">
          {/* Step 1 ── Informasi Pengiriman */}
          {step === 1 && (
            <div className="checkout-form">
              <h2>Informasi Pengiriman</h2>

              <div className="checkout-field">
                <label>Nama Penerima</label>
                <input
                  type="text"
                  placeholder="Masukkan nama penerima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="checkout-error">{errors.name}</span>}
              </div>

              <div className="checkout-field">
                <label>Alamat Lengkap</label>
                <textarea
                  placeholder="Jl. Contoh No. 123, Kota, Kode Pos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && <span className="checkout-error">{errors.address}</span>}
              </div>

              <div className="checkout-field">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <span className="checkout-error">{errors.phone}</span>}
              </div>

              <div className="checkout-field">
                <label>Pilih Kurir</label>
                <div className="checkout-option-group">
                  {COURIERS.map((c) => (
                    <label
                      key={c.id}
                      className={`checkout-option-card ${courier === c.id ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="courier"
                        value={c.id}
                        checked={courier === c.id}
                        onChange={() => setCourier(c.id)}
                      />
                      <div className="checkout-option-card-content">
                        <span className="checkout-option-name">{c.name}</span>
                        <span className="checkout-option-est">{c.est}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.courier && <span className="checkout-error">{errors.courier}</span>}
              </div>

              <div className="checkout-nav">
                <button type="button" className="btn-outline" onClick={goBack}>
                  <ArrowLeft size={16} /> Kembali ke Keranjang
                </button>
                <button type="button" className="btn-primary" onClick={goNext}>
                  Lanjut ke Pembayaran <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 ── Pembayaran */}
          {step === 2 && (
            <div className="checkout-form">
              <h2>Metode Pembayaran</h2>

              <div className="checkout-methods">
                <div className="checkout-method">
                  <input
                    type="radio"
                    id="m-transfer"
                    name="payment"
                    checked={method === "transfer"}
                    onChange={() => setMethod("transfer")}
                  />
                  <label htmlFor="m-transfer">
                    <div className="checkout-method-icon">TF</div>
                    <div className="checkout-method-info">
                      <span className="checkout-method-name">Transfer Bank</span>
                      <span className="checkout-method-desc">BCA, BNI, BRI, Mandiri</span>
                    </div>
                    <span className="checkout-method-check" />
                  </label>
                </div>

                <div className="checkout-method">
                  <input
                    type="radio"
                    id="m-ewallet"
                    name="payment"
                    checked={method === "ewallet"}
                    onChange={() => setMethod("ewallet")}
                  />
                  <label htmlFor="m-ewallet">
                    <div className="checkout-method-icon">EW</div>
                    <div className="checkout-method-info">
                      <span className="checkout-method-name">E-Wallet / QRIS</span>
                      <span className="checkout-method-desc">GoPay, OVO, DANA, ShopeePay</span>
                    </div>
                    <span className="checkout-method-check" />
                  </label>
                </div>

                <div className="checkout-method">
                  <input
                    type="radio"
                    id="m-cod"
                    name="payment"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                  />
                  <label htmlFor="m-cod">
                    <div className="checkout-method-icon">COD</div>
                    <div className="checkout-method-info">
                      <span className="checkout-method-name">Bayar di Tempat (COD)</span>
                      <span className="checkout-method-desc">Bayar saat paket tiba</span>
                    </div>
                    <span className="checkout-method-check" />
                  </label>
                </div>
              </div>

              {/* QRIS placeholder when E-Wallet / QRIS selected */}
              {method === "ewallet" && (
                <div className="checkout-qris">
                  <p className="checkout-qris-hint">
                    Scan QR Code di bawah ini menggunakan aplikasi e-wallet kamu:
                  </p>
                  <div className="checkout-qris-box">
                    <div className="checkout-qris-placeholder">
                      <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
                        <rect x="8" y="8" width="36" height="36" rx="4" stroke="var(--text-muted)" strokeWidth="4" />
                        <rect x="16" y="16" width="20" height="20" rx="2" fill="var(--text-muted)" />
                        <rect x="76" y="8" width="36" height="36" rx="4" stroke="var(--text-muted)" strokeWidth="4" />
                        <rect x="84" y="16" width="20" height="20" rx="2" fill="var(--text-muted)" />
                        <rect x="8" y="76" width="36" height="36" rx="4" stroke="var(--text-muted)" strokeWidth="4" />
                        <rect x="16" y="84" width="20" height="20" rx="2" fill="var(--text-muted)" />
                        <rect x="52" y="8" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="60" y="8" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="52" y="16" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="68" y="16" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="52" y="52" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="60" y="52" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="68" y="60" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="52" y="68" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="76" y="52" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="84" y="60" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="100" y="52" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="76" y="76" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="84" y="84" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="100" y="76" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="76" y="100" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="92" y="100" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="100" y="92" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="8" y="52" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="16" y="60" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="24" y="52" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="36" y="60" width="8" height="8" fill="var(--text-muted)" />
                        <rect x="8" y="68" width="8" height="8" fill="var(--text-muted)" />
                      </svg>
                      <span className="checkout-qris-label">QRIS Placeholder</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="checkout-nav">
                <button type="button" className="btn-outline" onClick={goBack}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <button type="button" className="btn-primary" onClick={goNext}>
                  Lanjut ke Konfirmasi <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 ── Konfirmasi & Ringkasan Total */}
          {step === 3 && (
            <div className="checkout-form">
              <h2>Konfirmasi Pesanan</h2>
              <p className="checkout-confirm-note">
                Pastikan seluruh data sudah sesuai sebelum melakukan pembayaran.
              </p>

              <div className="checkout-confirm-card">
                <h3>Informasi Pengiriman</h3>
                <div className="checkout-confirm-rows">
                  <div className="checkout-confirm-row">
                    <span className="label">Nama</span>
                    <span className="value">{name}</span>
                  </div>
                  <div className="checkout-confirm-row">
                    <span className="label">Alamat</span>
                    <span className="value">{address}</span>
                  </div>
                  <div className="checkout-confirm-row">
                    <span className="label">Telepon</span>
                    <span className="value">{phone}</span>
                  </div>
                  <div className="checkout-confirm-row">
                    <span className="label">Kurir</span>
                    <span className="value">
                      {selectedCourier ? `${selectedCourier.name} (${selectedCourier.est})` : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="checkout-confirm-card">
                <h3>Metode Pembayaran</h3>
                <div className="checkout-confirm-rows">
                  <div className="checkout-confirm-row">
                    <span className="label">Metode</span>
                    <span className="value">{paymentLabel}</span>
                  </div>
                </div>
              </div>

              <div className="checkout-confirm-card">
                <h3>Produk Dipesan</h3>
                <div className="checkout-confirm-items">
                  {items.map((item) => (
                    <div
                      className="checkout-confirm-item"
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
                <div className="checkout-confirm-divider" />
                <div className="checkout-confirm-row total">
                  <span className="label">Total Pembayaran</span>
                  <span className="value">{formatRupiah(total)}</span>
                </div>
              </div>

              <div className="checkout-nav">
                <button type="button" className="btn-outline" onClick={goBack} disabled={paying}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <button
                  type="button"
                  className="btn-primary checkout-pay-btn"
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying ? (
                    <>
                      <Loader2 size={18} className="checkout-spin" />
                      Memproses Pembayaran...
                    </>
                  ) : (
                    "Bayar Sekarang"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar summary ── */}
        <div className="checkout-summary-card">
          <h3>Ringkasan Pembayaran</h3>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div
                className="checkout-summary-item"
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
          <div className="checkout-summary-divider" />
          <div className="checkout-summary-row">
            <span>Total Item</span>
            <span>{totalItems} produk</span>
          </div>
          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Ongkos Kirim</span>
            <span>{formatRupiah(SHIPPING_COST)}</span>
          </div>
          <div className="checkout-summary-divider" />
          <div className="checkout-summary-row total">
            <span>Total Pembayaran</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>
      </div>

      {/* ── Loading overlay ── */}
      {paying && (
        <div className="checkout-overlay">
          <div className="checkout-overlay-content">
            <Loader2 size={48} className="checkout-spin" />
            <h2>Memproses Pembayaran...</h2>
            <p>Mohon jangan tutup atau refresh halaman ini.</p>
          </div>
        </div>
      )}
    </div>
  );
}
