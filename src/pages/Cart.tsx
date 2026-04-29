import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";
import "./Cart.css";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const loggedIn = !!(localStorage.getItem("decant_user_pref") || localStorage.getItem("decant_user_data"));
    if (!loggedIn) {
      alert("Silakan login terlebih dahulu untuk melakukan checkout!");
      navigate("/auth");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="page-container cart-page">
        <h1>Keranjang</h1>
        <div className="cart-empty">
          <p>Keranjangmu masih kosong</p>
          <Link to="/catalog" className="btn-primary">
            Jelajahi Katalog
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="page-container cart-page">
      <h1>Keranjang</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div
              className="cart-item"
              key={`${item.product.product_id}-${item.sizeKey}`}
            >
              <div className="cart-item-image">
                {item.product.image_filename.replace(".png", "")}
              </div>
              <div className="cart-item-info">
                <span className="cart-item-brand">{item.product.brand}</span>
                <span className="cart-item-name">{item.product.product_name}</span>
                <span className="cart-item-size">Ukuran: {item.sizeLabel}</span>
                <span className="cart-item-price">
                  {formatRupiah(item.unitPrice * item.quantity)}
                </span>
              </div>
              <div className="cart-item-actions">
                <div className="cart-qty">
                  <button
                    type="button"
                    title="Kurangi jumlah produk"
                    aria-label="Kurangi jumlah produk"
                    onClick={() =>
                      updateQuantity(
                        item.product.product_id,
                        item.sizeKey,
                        item.quantity - 1
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    title="Tambah jumlah produk"
                    aria-label="Tambah jumlah produk"
                    onClick={() =>
                      updateQuantity(
                        item.product.product_id,
                        item.sizeKey,
                        item.quantity + 1
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="cart-remove-btn"
                  type="button"
                  title="Hapus produk dari keranjang"
                  aria-label="Hapus produk dari keranjang"
                  onClick={() =>
                    removeFromCart(item.product.product_id, item.sizeKey)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Ringkasan Pesanan</h2>
          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span className="label">Total Item</span>
              <span className="value">{totalItems} produk</span>
            </div>
            <div className="cart-summary-row">
              <span className="label">Subtotal</span>
              <span className="value">{formatRupiah(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="label">Ongkos Kirim</span>
              <span className="value">Dihitung saat checkout</span>
            </div>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-total">
            <span className="label">Total</span>
            <span className="value">{totalPrice}</span>
          </div>
          <button className="btn-primary" onClick={handleCheckout}>
            Lanjut ke Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
