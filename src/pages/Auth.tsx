import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flower, TreePine, Sun, Flame, Droplets, Wind } from "lucide-react";
import "./Auth.css";

type AromaPref = "Floral" | "Woody" | "Citrus" | "Spicy" | "Aquatic" | "Fresh";
type GenderPref = "Unisex" | "Female" | "Masculine";

const AROMA_OPTIONS: { label: AromaPref; icon: string }[] = [
  { label: "Floral", icon: "flower" },
  { label: "Woody", icon: "tree" },
  { label: "Citrus", icon: "sun" },
  { label: "Spicy", icon: "flame" },
  { label: "Aquatic", icon: "droplet" },
  { label: "Fresh", icon: "wind" },
];

const GENDER_OPTIONS: GenderPref[] = ["Unisex", "Female", "Masculine"];

const PREF_STORAGE_KEY = "decant_user_pref";

function AromaIcon({ type }: { type: string }) {
  const size = 18;
  switch (type) {
    case "flower":
      return <Flower size={size} />;
    case "tree":
      return <TreePine size={size} />;
    case "sun":
      return <Sun size={size} />;
    case "flame":
      return <Flame size={size} />;
    case "droplet":
      return <Droplets size={size} />;
    case "wind":
      return <Wind size={size} />;
    default:
      return null;
  }
}

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPreference, setShowPreference] = useState(false);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");

  // Preference state
  const [selectedAroma, setSelectedAroma] = useState<AromaPref | "">("");
  const [selectedGender, setSelectedGender] = useState<GenderPref | "">("");
  const [prefError, setPrefError] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || regPassword.trim().length < 8) {
      setRegError("Lengkapi data akun. Password minimal 8 karakter.");
      return;
    }
    setRegError("");
    setShowPreference(true);
  };

  const handlePreferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAroma || !selectedGender) {
      setPrefError("Pilih aroma favorit dan gender preference terlebih dahulu.");
      return;
    }

    const prefs = {
      aroma: selectedAroma,
      gender: selectedGender,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(prefs));
    setPrefError("");
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Decant Temcy</h1>
            <p>Temukan parfum signature-mu</p>
          </div>

          {/* ── Preference form (shown after register) ── */}
          {showPreference ? (
            <div className="auth-pref">
              <div className="auth-pref-head">
                <h2>Personalisasi Preferensi</h2>
                <p>Bantu kami merekomendasikan parfum yang tepat untuk kamu.</p>
              </div>

              <form className="auth-pref-form" onSubmit={handlePreferenceSubmit}>
                <div className="auth-pref-group">
                  <p className="auth-pref-question">
                    Pilih Aroma Favorit
                  </p>
                  <div className="auth-pref-chips">
                    {AROMA_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        className={`auth-pref-chip ${selectedAroma === option.label ? "active" : ""}`}
                        onClick={() => setSelectedAroma(option.label)}
                      >
                        <span className="auth-pref-chip-icon">
                          <AromaIcon type={option.icon} />
                        </span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="auth-pref-group">
                  <p className="auth-pref-question">
                    Gender Preference
                  </p>
                  <div className="auth-pref-chips">
                    {GENDER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`auth-pref-chip ${selectedGender === option ? "active" : ""}`}
                        onClick={() => setSelectedGender(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {prefError && <p className="auth-pref-error">{prefError}</p>}

                <button type="submit" className="auth-submit">
                  Selesai & Mulai Jelajahi
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* ── Tabs ── */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${tab === "login" ? "active" : ""}`}
                  onClick={() => setTab("login")}
                >
                  Masuk
                </button>
                <button
                  className={`auth-tab ${tab === "register" ? "active" : ""}`}
                  onClick={() => setTab("register")}
                >
                  Daftar
                </button>
              </div>

              <button className="auth-google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Lanjutkan dengan Google
              </button>

              <div className="auth-divider">atau</div>

              {/* ── Login form ── */}
              {tab === "login" && (
                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="auth-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="contoh@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="auth-submit">
                    Masuk
                  </button>
                </form>
              )}

              {/* ── Register form ── */}
              {tab === "register" && (
                <form className="auth-form" onSubmit={handleRegisterSubmit}>
                  <div className="auth-field">
                    <label>Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="contoh@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>

                  {regError && <p className="auth-field-error">{regError}</p>}

                  <button type="submit" className="auth-submit">
                    Daftar
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="auth-footer">
          Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan kami
        </p>
      </div>
    </div>
  );
}
