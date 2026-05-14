import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products, sizeOptions, formatRupiah } from "../data/products";
import { useCart, SizeKey } from "../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.product_id === Number(id));

  const [selectedSize, setSelectedSize] = useState<SizeKey>("price_1ml");

  if (!product) {
    return (
      <div className="page-container">
        <p className="detail-empty-state">
          Produk tidak ditemukan.
        </p>
      </div>
    );
  }

  const currentPrice = product[selectedSize] as number;
  const selectedLabel = sizeOptions.find((s) => s.key === selectedSize)?.label ?? "1ml";

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedLabel);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedLabel);
    navigate("/cart");
  };

  return (
    <div className="page-container detail-page">
      <div className="detail-layout">
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            <div className="detail-image-placeholder">
              {product.image_filename.replace(".png", "")}
            </div>
          </div>
        </div>

        <div className="detail-info-section">
          <div>
            <div className="detail-brand">{product.brand}</div>
            <h1 className="detail-name">{product.product_name}</h1>
            <span className="detail-concentration">{product.concentration}</span>
          </div>

          <div className="detail-price">
            {formatRupiah(currentPrice)}
            <span className="detail-price-label">/ {selectedLabel}</span>
          </div>

          <div className="detail-divider" />

          <div>
            <div className="detail-section-title">Profil Aroma</div>
            <div className="detail-notes">
              <div className="detail-note-row">
                <span className="detail-note-label">Top Notes</span>
                <span className="detail-note-value">{product.top_notes}</span>
              </div>
              <div className="detail-note-row">
                <span className="detail-note-label">Middle Notes</span>
                <span className="detail-note-value">{product.middle_notes}</span>
              </div>
              <div className="detail-note-row">
                <span className="detail-note-label">Base Notes</span>
                <span className="detail-note-value">{product.base_notes}</span>
              </div>
            </div>
          </div>

          <div className="detail-divider" />

          <div>
            <div className="detail-section-title">Pilih Ukuran</div>
            <div className="detail-sizes">
              {sizeOptions.map((opt) => (
                <div className="detail-size-option" key={opt.key}>
                  <input
                    type="radio"
                    id={opt.key}
                    name="size"
                    checked={selectedSize === opt.key}
                    onChange={() => setSelectedSize(opt.key)}
                  />
                  <label htmlFor={opt.key}>{opt.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-outline" onClick={handleAddToCart}>
              + Tambah ke Keranjang
            </button>
            <button className="btn-primary" onClick={handleBuyNow}>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
