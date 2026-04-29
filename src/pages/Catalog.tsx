import { useState } from "react";
import { Link } from "react-router-dom";
import { products, formatRupiah } from "../data/products";
import { useSearch } from "../context/SearchContext";
import "./Catalog.css";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { query } = useSearch();

  const brands = ["all", ...new Set(products.map((p) => p.brand))];

  const searchFiltered = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.product_name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const filtered =
    activeFilter === "all"
      ? searchFiltered
      : searchFiltered.filter((p) => p.brand === activeFilter);

  return (
    <div className="page-container catalog-page">
      <h2 className="section-title">Katalog Parfum</h2>

      <div className="catalog-filters">
        {brands.map((brand) => (
          <button
            key={brand}
            className={`catalog-filter-chip ${activeFilter === brand ? "active" : ""}`}
            onClick={() => setActiveFilter(brand)}
          >
            {brand === "all" ? "Semua" : brand}
          </button>
        ))}
      </div>

      <div className="product-grid">
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
