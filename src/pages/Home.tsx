import { Link } from "react-router-dom";
import { products, formatRupiah } from "../data/products";
import { useSearch } from "../context/SearchContext";
import "./Home.css";

interface UserPref {
  aroma: string;
  gender: string;
  savedAt: string;
}

const PREF_KEY = "decant_user_pref";

const AROMA_KEYWORDS: Record<string, string[]> = {
  Floral: ["jasmine", "rose", "iris", "lily", "peony", "violet", "lavender", "geranium", "floral", "magnolia", "tuberose"],
  Woody: ["cedarwood", "cedar", "sandalwood", "vetiver", "oud", "patchouli", "woody", "pine", "cashmere"],
  Citrus: ["bergamot", "lemon", "mandarin", "orange", "citrus", "grapefruit", "lime", "yuzu"],
  Spicy: ["cinnamon", "pepper", "cardamom", "clove", "ginger", "nutmeg", "spicy", "saffron"],
  Aquatic: ["sea", "ocean", "marine", "aquatic", "water", "salty", "calone", "seaweed"],
  Fresh: ["mint", "eucalyptus", "green", "tea", "cucumber", "fresh", "clean", "neroli", "petitgrain"],
};

const GENDER_KEYWORDS: Record<string, string[]> = {
  Unisex: ["unisex", "universal", "genderless", "shared"],
  Female: ["floral", "rose", "jasmine", "peony", "lily", "vanilla", "sweet", "powdery", "iris", "magnolia"],
  Masculine: ["woody", "leather", "oud", "tobacco", "spicy", "musk", "vetiver", "cedarwood", "patchouli", "smoky"],
};

function getUserPref(): UserPref | null {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserPref;
  } catch {
    return null;
  }
}

function getRecommendations(pref: UserPref) {
  const aromaKeys = AROMA_KEYWORDS[pref.aroma] ?? [];
  const genderKeys = GENDER_KEYWORDS[pref.gender] ?? [];
  const allKeywords = [...aromaKeys, ...genderKeys];

  const scored = products.map((p) => {
    const searchable = [
      p.top_notes.toLowerCase(),
      p.middle_notes.toLowerCase(),
      p.base_notes.toLowerCase(),
      p.brand.toLowerCase(),
      p.product_name.toLowerCase(),
      p.concentration.toLowerCase(),
    ].join(" ");

    let score = 0;
    for (const kw of allKeywords) {
      if (searchable.includes(kw.toLowerCase())) {
        score += aromaKeys.includes(kw) ? 2 : 1;
      }
    }
    return { product: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.product);
}

export default function Home() {
  const { query } = useSearch();

  const filtered = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.product_name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const userPref = getUserPref();
  const recommended = userPref ? getRecommendations(userPref) : [];

  return (
    <div className="page-container home-page">
      <div className="home-hero">
        <h1>
          Temukan <span>Signature Scent</span> Kamu
        </h1>
        <p>
          Koleksi parfum premium dalam ukuran decant. Coba sebelum commit ke botol penuh.
        </p>
      </div>

      {/* ── Recommendation section ── */}
      {userPref && recommended.length > 0 && (
        <section className="home-recommend">
          <div className="home-recommend-header">
            <h2 className="home-recommend-title">
              <span className="home-recommend-sparkle" aria-hidden="true">&#10024;</span>
              Rekomendasi Untukmu
            </h2>
            <p className="home-recommend-subtitle">
              Berdasarkan preferensi <strong>{userPref.aroma}</strong> &amp; gender <strong>{userPref.gender}</strong> kamu
            </p>
          </div>
          <div className="home-recommend-grid">
            {recommended.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={`rec-${product.product_id}`}
                className="product-card home-recommend-card"
              >
                <div className="product-card-image">
                  <span className="badge-bestseller">BEST SELLER</span>
                  <div className="product-card-placeholder">
                    {product.image_filename.replace(".png", "")}
                  </div>
                </div>
                <div className="product-card-body">
                  <div className="product-card-brand">{product.brand}</div>
                  <div className="product-card-name">{product.product_name}</div>
                  <div className="product-card-price">
                    Mulai <strong>{formatRupiah(product.price_1ml)}</strong>/1ml
                    <span className="product-card-concentration">
                      {product.concentration}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <h2 className="section-title">
        {query.trim() ? `Hasil pencarian "${query}"` : "Produk Unggulan"}
      </h2>

      <div className="product-grid">
        {filtered.length === 0 && (
          <p className="home-empty-state">
            Tidak ada produk yang cocok dengan pencarian kamu.
          </p>
        )}
        {filtered.map((product) => (
          <Link
            to={`/product/${product.product_id}`}
            key={product.product_id}
            className="product-card"
          >
            <div className="product-card-image">
              <span className="badge-bestseller">BEST SELLER</span>
              <div className="product-card-placeholder">
                {product.image_filename.replace(".png", "")}
              </div>
            </div>
            <div className="product-card-body">
              <div className="product-card-brand">{product.brand}</div>
              <div className="product-card-name">{product.product_name}</div>
              <div className="product-card-price">
                Mulai <strong>{formatRupiah(product.price_1ml)}</strong>/1ml
                <span className="product-card-concentration">
                  {product.concentration}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}