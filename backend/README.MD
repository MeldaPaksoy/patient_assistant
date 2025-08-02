# Patient Assistant API

## 📁 Proje Yapısı

```
patient-assistant-api/
├── app/
│   ├── __init__.py              # Ana paket
│   ├── main.py                  # FastAPI uygulaması ve startup
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py          # Konfigürasyon ayarları
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── models.py            # Auth Pydantic modelleri
│   │   ├── routes.py            # Auth endpoint'leri
│   │   ├── service.py           # Auth iş mantığı ve Firebase entegrasyonu
│   │   └── dependencies.py      # Firebase auth ve token doğrulama
│   ├── chat/
│   │   ├── __init__.py
│   │   ├── models.py            # Chat Pydantic modelleri
│   │   ├── routes.py            # Chat endpoint'leri
│   │   └── service.py           # Chat iş mantığı
│   ├── core/
│   │   ├── __init__.py
│   │   ├── model_manager.py     # ML model yönetimi
│   │   └── session_manager.py   # Session ve memory yönetimi
│   └── utils/
│       ├── __init__.py
│       └── prompts.py           # Sistem prompt'ları
├── .env                         # Environment variables
├── requirements.txt             # Python bağımlılıkları
└── README.md
```

## 🚀 Kurulum

### 1. Virtual environment oluşturun

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate     # Windows
```

### 2. Bağımlılıkları yükleyin

```bash
pip install -r requirements.txt
```

### 3. Environment variables ayarlayın

`.env` dosyası oluşturun:

```env
API_KEY=your_firebase_api_key
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/service-account.json
```

### 4. Uygulamayı çalıştırın

```bash
python -m app.main
# veya
uvicorn app.main:app --reload
```

## 📚 API Endpoints

### 🔐 Authentication

- `POST /auth/signup` - Kullanıcı kaydı (Firebase Auth: email/password, Firestore: email + tüm profil bilgileri)
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/reset-password` - Şifre sıfırlama
- `GET /auth/profile` - Kullanıcı profili (Firestore'dan)
- `PUT /auth/update-profile` - Profil güncelleme (sadece değişebilen alanlar: email, şifre, boy, kilo, alerjiler, hastalıklar, ilaçlar, ameliyatlar)
- `DELETE /auth/delete-account` - Hesap silme (Firebase Auth + Firestore + Chat History)

### 💬 Chat

- `POST /chat/` - Normal chat (tek yanıt)
- `POST /chat/stream` - Streaming chat (anlık yanıt)
- `GET /chat/session` - Session bilgisi
- `DELETE /chat/session` - Session temizleme
- `GET /chat/history` - Chat geçmişi

### 🔊 Text-to-Speech

**Frontend-based TTS** desteği mevcuttur. API response'unda `supports_tts: true` ile TTS'nin kullanılabileceği belirtilir.

**Özellikler:**

- ✅ Web Speech API kullanımı
- ✅ Sıfır sunucu yükü
- ✅ Türkçe optimize
- ✅ Gerçek zamanlı

**Implementasyon:** `frontend-tts-guide.js` dosyasında detaylı kod örneği bulunmaktadır.

### 🛠 Admin

- `GET /admin/sessions` - Tüm session'ları listele
- `DELETE /admin/sessions` - Tüm session'ları temizle

### 📊 System

- `GET /health` - Sistem durumu
- `GET /docs` - API dokümantasyonu

### Katman Yapısı

1. **Presentation Layer** (`routes.py`): API endpoint'leri
2. **Business Layer** (`service.py`): İş mantığı
3. **Data Layer** (`dependencies.py`, `model_manager.py`): Veri erişimi
4. **Configuration Layer** (`settings.py`): Konfigürasyon yönetimi

### Önemli Bileşenler

#### ModelManager

- ML model yükleme ve yönetimi
- GPU/CPU optimizasyonları
- Streaming ve normal yanıt üretimi

#### SessionManager

- Kullanıcı session'larının yönetimi
- Memory window'lar ile konuşma geçmişi
- Thread-safe işlemler

#### ChatService

- Chat iş mantığının merkezi yönetimi
- Model ve session manager'lar arası koordinasyon
- Error handling ve logging

## 🔧 Konfigürasyon

### Firebase Entegrasyonu

Bu API Firebase Authentication ve Firestore kullanır:

#### Firebase Auth'ta Saklanan Bilgiler:

- Email (kimlik doğrulama için)
- Password (şifrelenmiş)

#### Firestore'da Saklanan Bilgiler:

- Email (Firebase Auth ile senkronize)
- First Name, Last Name
- Gender (Cinsiyet)
- Allergies (Alerjiler)
- Diseases (Hastalıklar)
- Medications (İlaçlar)
- Age (Yaş)
- Height (Boy)
- Weight (Kilo)
- Past Surgeries (Geçmiş Ameliyatlar)
- Chat History (Sohbet Geçmişi)

#### Profil Güncelleme Kısıtlamaları:

**Değişmeyen Alanlar (Kayıt sırasında belirlenir):**

- First Name (Ad)
- Last Name (Soyad)
- Age (Yaş)
- Gender (Cinsiyet)

**Değişebilen Alanlar:**

- Email (Firebase Auth + Firestore'da güncellenir)
- Password (Firebase Auth + Firestore'da güncellenir)
- Height (Boy)
- Weight (Kilo)
- Allergies (Alerjiler)
- Diseases (Hastalıklar)
- Medications (İlaçlar)
- Past Surgeries (Geçmiş Ameliyatlar)

### Model Ayarları

`app/config/settings.py` dosyasında:

```python
MODEL_ID = "google/medgemma-4b-it"
MAX_NEW_TOKENS = 512
TEMPERATURE = 0.2
MEMORY_WINDOW_SIZE = 8
```

### Firebase Ayarları

Environment variables ile:

- `API_KEY`: Firebase API anahtarı
- `MESSAGING_SENDER_ID`: Messaging sender ID
- `APP_ID`: Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Service account JSON dosya yolu

## 🧪 Test Etme

### Health Check

```bash
curl http://localhost:8000/health
```

### Kullanıcı Kaydı

```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "gender": "Erkek",
    "age": 30,
    "allergies": ["Penisilin"],
    "diseases": ["Diyabet"],
    "medications": ["İnsülin"]
  }'
```

### Profil Güncelleme

```bash
curl -X PUT "http://localhost:8000/auth/update-profile" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yeni@example.com",
    "password": "yeni_sifre123",
    "height_cm": 175.5,
    "weight_kg": 70.2,
    "allergies": ["Penisilin", "Lateks"],
    "diseases": ["Diyabet", "Hipertansiyon"],
    "medications": ["İnsülin", "Tansiyon ilacı"],
    "past_surgeries": ["Apendisit ameliyatı"]
  }'
```

### Chat Test (Authentication gerekli)

```bash
curl -X POST "http://localhost:8000/chat/" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Merhaba, nasılsın?"}'

# Response örneği:
# {
#   "response": "Merhaba! Size nasıl yardımcı olabilirim?",
#   "session_id": "user123_session456",
#   "supports_tts": true
# }
```

### TTS Test (Frontend)

```javascript
// JavaScript console'da test
const response = await fetch("/chat/", {
  method: "POST",
  headers: {
    Authorization: "Bearer your-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: "Test mesajı" }),
});

const data = await response.json();
if (data.supports_tts) {
  // TTS fonksiyonu çağır
  tts.speak(data.response);
}
```

## 🔒 Güvenlik Özellikleri

- **Firebase Authentication**: Güvenli kullanıcı kimlik doğrulama
- **Token-based Authorization**: JWT token ile endpoint koruması
- **Data Separation**: Hassas bilgiler Firebase Auth'ta, ek bilgiler Firestore'da
- **Account Deletion**: Hesap silme işlemi tüm verileri temizler (Auth + Firestore + Chat History)
