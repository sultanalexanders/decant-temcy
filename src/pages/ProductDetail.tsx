import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { products, sizeOptions, formatRupiah } from "../data/products";
import { useCart, SizeKey } from "../context/CartContext";
import "./ProductDetail.css";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

const REVIEWS_KEY = "decant_reviews";

function loadReviews(productId: number): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<number, Review[]>;
    return all[productId] ?? [];
  } catch {
    return [];
  }
}

function saveReviews(productId: number, reviews: Review[]) {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all = raw ? JSON.parse(raw) as Record<number, Review[]> : {};
    all[productId] = reviews;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

const DUMMY_REVIEWS: Review[] = [
  { name: "Rina S.", rating: 5, text: "Aromanya sangat tahan lama, cocok untuk acara formal.", date: "20 Apr 2026" },
  { name: "Budi P.", rating: 4, text: "Wangiannya enak, tapi untuk harga segini bisa lebih tahan lama.", date: "22 Apr 2026" },
  { name: "Sari M.", rating: 5, text: "Favorit saya! Setiap dipakai selalu dapat pujian.", date: "25 Apr 2026" },
];

function isLoggedIn(): boolean {
  try {
    const pref = localStorage.getItem("decant_user_pref");
    const userData = localStorage.getItem("decant_user_data");
    return !!(pref || userData);
  } catch {
    return false;
  }
}

function getUserName(): string {
  try {
    const raw = localStorage.getItem("decant_user_data");
    if (raw) {
      const data = JSON.parse(raw);
      return data.name ?? "Pengguna";
    }
    return "Pengguna";
  } catch {
    return "Pengguna";
  }
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.product_id === Number(id));

  const [selectedSize, setSelectedSize] = useState<SizeKey>("price_1ml");
  const [reviews, setReviews] = useState<Review[]>(() =>
    product ? [...DUMMY_REVIEWS, ...loadReviews(product.product_id)] : []
  );
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    const newReview: Review = {
      name: getUserName(),
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(product.product_id, updated.filter((r) => !DUMMY_REVIEWS.includes(r)));
    setReviewText("");
    setReviewRating(0);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

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

      {/* ── Reviews section ── */}
      <div className="detail-reviews-section">
        <div className="detail-reviews-header">
          <h2>Ulasan Pelanggan</h2>
          <div className="detail-reviews-avg">
            <Star size={16} className="detail-star-filled" />
            <span>{avgRating}</span>
            <span className="detail-reviews-count">({reviews.length} ulasan)</span>
          </div>
        </div>

        {isLoggedIn() ? (
          <div className="detail-review-form">
            <h3>Tulis Ulasan</h3>
            <div className="detail-review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`detail-star-btn ${(hoverRating || reviewRating) >= star ? "active" : ""}`}
                  onClick={() => setReviewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star size={20} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Bagikan pengalamanmu dengan parfum ini..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              className="btn-primary detail-review-submit"
              onClick={handleSubmitReview}
              disabled={!reviewText.trim() || reviewRating === 0}
            >
              Kirim Ulasan
            </button>
          </div>
        ) : (
          <div className="detail-review-login-prompt">
            <p>Silakan <Link to="/auth">Login di sini</Link> untuk menulis ulasan</p>
          </div>
        )}

        <div className="detail-reviews-list">
          {reviews.map((review, idx) => (
            <div key={idx} className="detail-review-card">
              <div className="detail-review-top">
                <span className="detail-review-name">{review.name}</span>
                <div className="detail-review-rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < review.rating ? "detail-star-filled" : "detail-star-empty"}
                    />
                  ))}
                </div>
              </div>
              <p className="detail-review-text">{review.text}</p>
              <span className="detail-review-date">{review.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
