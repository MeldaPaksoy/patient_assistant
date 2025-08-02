import { useState, FormEvent } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { SignupRequest } from "@/services/patientAssistantApi";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [heightCm, setHeightCm] = useState<number | undefined>();
  const [weightKg, setWeightKg] = useState<number | undefined>();
  const [allergiesText, setAllergiesText] = useState("");
  const [diseasesText, setDiseasesText] = useState("");
  const [medicationsText, setMedicationsText] = useState("");
  const [surgeriesText, setSurgeriesText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const signupData: SignupRequest = {
          email,
          password,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          gender: gender || undefined,
          age: age || undefined,
          height_cm: heightCm || undefined,
          weight_kg: weightKg || undefined,
          allergies: allergiesText.trim() ? allergiesText.split(',').map(s => s.trim()).filter(Boolean) : undefined,
          diseases: diseasesText.trim() ? diseasesText.split(',').map(s => s.trim()).filter(Boolean) : undefined,
          medications: medicationsText.trim() ? medicationsText.split(',').map(s => s.trim()).filter(Boolean) : undefined,
          past_surgeries: surgeriesText.trim() ? surgeriesText.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        };
        await signup(signupData);
      }
      onClose();
      // Reset form
      resetForm();
    } catch (err) {
      // Error is handled by the auth context
      console.error("Auth error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setGender("");
    setAge(undefined);
    setHeightCm(undefined);
    setWeightKg(undefined);
    setAllergiesText("");
    setDiseasesText("");
    setMedicationsText("");
    setSurgeriesText("");
  };

  const handleClose = () => {
    clearError();
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ad</label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Adınız"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soyad</label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Soyadınız"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cinsiyet</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Erkek">Erkek</SelectItem>
                      <SelectItem value="Kadın">Kadın</SelectItem>
                      <SelectItem value="Diğer">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Yaş</label>
                  <Input
                    type="number"
                    value={age || ""}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Yaş"
                    min="1"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Boy (cm)</label>
                  <Input
                    type="number"
                    value={heightCm || ""}
                    onChange={(e) => setHeightCm(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="170"
                    min="50"
                    max="250"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kilo (kg)</label>
                <Input
                  type="number"
                  value={weightKg || ""}
                  onChange={(e) => setWeightKg(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="70"
                  min="10"
                  max="500"
                  step="0.1"
                />
              </div>

              {/* Sağlık Bilgileri */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Alerjiler (virgülle ayırın)</label>
                <Input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="Penisilin, Polen, vb."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kronik Hastalıklar (virgülle ayırın)</label>
                <Input
                  type="text"
                  value={diseasesText}
                  onChange={(e) => setDiseasesText(e.target.value)}
                  placeholder="Diyabet, Hipertansiyon, vb."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Medications You Use (separate with commas)</label>
                <Input
                  type="text"
                  value={medicationsText}
                  onChange={(e) => setMedicationsText(e.target.value)}
                  placeholder="İnsülin, Aspirin, vb."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Geçmiş Ameliyatlar (virgülle ayırın)</label>
                <Input
                  type="text"
                  value={surgeriesText}
                  onChange={(e) => setSurgeriesText(e.target.value)}
                  placeholder="Apendisit, Kalp ameliyatı, vb."
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email adresiniz"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreniz"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              clearError();
            }}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
} 