import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

type RegisterStep = "account" | "preferences";
type AromaPreference =
  | "Floral"
  | "Woody"
  | "Citrus"
  | "Spicy"
  | "Aquatic"
  | "Oriental"
  | "Fresh"
  | "Musky";
type GenderPreference = "Unisex" | "Feminine" | "Masculine";

interface RegisterProfile {
  name: string;
  email: string;
  aromaPreference: AromaPreference;
  genderPreference: GenderPreference;
  registeredAt: string;
}

const AROMA_OPTIONS: AromaPreference[] = [
  "Floral",
  "Woody",
  "Citrus",
  "Spicy",
  "Aquatic",
  "Oriental",
  "Fresh",
  "Musky",
];

const GENDER_OPTIONS: GenderPreference[] = ["Unisex", "Feminine", "Masculine"];

const PROFILE_STORAGE_KEY = "decant-temcy-user-profile";

interface RegisterProps {
  onRegistered?: () => void;
}

export default function Register({ onRegistered }: RegisterProps) {
  const navigate = useNavigate();

  const [step, setStep] = useState<RegisterStep>("account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAroma, setSelectedAroma] = useState<AromaPreference | "">("");
  const [selectedGender, setSelectedGender] = useState<GenderPreference | "">("");
  const [errorMessage, setErrorMessage] = useState("");

  const canContinueAccount = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && password.trim().length >= 8;
  }, [name, email, password]);

  const handleAccountSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinueAccount) {
      setErrorMessage("Lengkapi data akun. Password minimal 8 karakter.");
      return;
    }
    setErrorMessage("");
    setStep("preferences");
  };

  const handlePreferenceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAroma || !selectedGender) {
      setErrorMessage("Pilih aroma favorit dan preferensi gender terlebih dahulu.");
      return;
    }

    const profile: RegisterProfile = {
      name: name.trim(),
      email: email.trim(),
      aromaPreference: selectedAroma,
      genderPreference: selectedGender,
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setErrorMessage("");
    onRegistered?.();
    navigate("/");
  };

  return (
    <div className="register-flow">
      {step === "account" ? (
        <form className="auth-form" onSubmit={handleAccountSubmit}>
          <div className="auth-field">
            <label>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          {errorMessage && <p className="register-error-message">{errorMessage}</p>}

          <button type="submit" className="auth-submit">
            Daftar
          </button>
        </form>
      ) : (
        <form className="register-preferences-form" onSubmit={handlePreferenceSubmit}>
          <div className="register-preferences-head">
            <h3>Preferensi Aroma</h3>
            <p>Lengkapi preferensi agar rekomendasi parfum lebih personal.</p>
          </div>

          <div className="register-preferences-group">
            <p className="register-preferences-title">Aroma apa yang Anda sukai?</p>
            <div className="register-choice-grid">
              {AROMA_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`register-choice-card ${selectedAroma === option ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="aroma"
                    value={option}
                    checked={selectedAroma === option}
                    onChange={() => setSelectedAroma(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="register-preferences-group">
            <p className="register-preferences-title">Preferensi Gender</p>
            <div className="register-choice-grid register-choice-grid-gender">
              {GENDER_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`register-choice-card ${selectedGender === option ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={selectedGender === option}
                    onChange={() => setSelectedGender(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {errorMessage && <p className="register-error-message">{errorMessage}</p>}

          <div className="register-preferences-actions">
            <button type="button" className="btn-outline" onClick={() => setStep("account")}>
              Kembali
            </button>
            <button type="submit" className="btn-primary">
              Simpan & Lanjut ke Beranda
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
