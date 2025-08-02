# Patient Assistant - Kurulum ve Çalıştırma

Bu dokümanda Patient Assistant API'sini ve frontend uygulamasını nasıl kuracağınızı ve çalıştıracağınızı öğreneceksiniz.

## 🚀 Hızlı Başlangıç

### 1. Backend (Patient Assistant API) Kurulumu

```bash
# Patient Assistant API dizinine gidin
cd patient-assistant-api

# Virtual environment oluşturun
python -m venv venv

# Virtual environment'ı aktifleştirin
# Windows için:
venv\Scripts\activate
# macOS/Linux için:
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Environment dosyasını oluşturun
cp env.example .env

# .env dosyasını düzenleyin (Firebase ayarlarını ekleyin)
# Önemli: Firebase service account JSON dosyasını indirin ve yolu belirtin
```

### 2. Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni bir proje oluşturun
3. Authentication'ı etkinleştirin (Email/Password)
4. Service Account oluşturun:
   - Project Settings > Service Accounts
   - "Generate new private key" butonuna tıklayın
   - JSON dosyasını `patient-assistant-api/` dizinine kaydedin
5. `.env` dosyasını düzenleyin:

```env
# Firebase Configuration
API_KEY=your_firebase_api_key
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json

# Model Configuration
MODEL_ID=google/medgemma-4b-it
MAX_NEW_TOKENS=512
TEMPERATURE=0.2
MEMORY_WINDOW_SIZE=8

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Backend'i Çalıştırın

```bash
# Patient Assistant API'yi başlatın
python -m app.main

# Veya uvicorn ile:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API şu adreste çalışacak: `http://localhost:8000`

### 4. Frontend Kurulumu

```bash
# Ana dizine dönün
cd ..

# Frontend bağımlılıklarını yükleyin
npm install

# Frontend'i başlatın
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:5173`

## 🧪 Test Etme

### API Testi

```bash
# Integration test scriptini çalıştırın
node test-integration.js
```

### Manuel Test

1. Frontend'i açın: `http://localhost:5173`
2. Sağ alt köşedeki chat ikonuna tıklayın
3. "Giriş Yap" butonuna tıklayın
4. Yeni hesap oluşturun veya mevcut hesapla giriş yapın
5. Sağlık sorularınızı sorun!

## 📋 API Endpoints

### Authentication
- `POST /auth/signup` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/reset-password` - Şifre sıfırlama
- `GET /auth/profile` - Kullanıcı profili
- `DELETE /auth/delete-account` - Hesap silme

### Chat
- `POST /chat/` - Normal chat
- `POST /chat/stream` - Streaming chat
- `GET /chat/session` - Session bilgisi
- `DELETE /chat/session` - Session temizleme

### System
- `GET /health` - Sistem durumu
- `GET /docs` - API dokümantasyonu

## 🔧 Konfigürasyon

### Model Ayarları
- `MODEL_ID`: Kullanılacak ML modeli (varsayılan: google/medgemma-4b-it)
- `MAX_NEW_TOKENS`: Maksimum token sayısı
- `TEMPERATURE`: Yanıt çeşitliliği (0.0-1.0)
- `MEMORY_WINDOW_SIZE`: Konuşma geçmişi penceresi

### Firebase Ayarları
- `API_KEY`: Firebase API anahtarı
- `MESSAGING_SENDER_ID`: Messaging sender ID
- `APP_ID`: Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Service account JSON dosya yolu

## 🐛 Sorun Giderme

### API Bağlantı Sorunu
```bash
# API'nin çalışıp çalışmadığını kontrol edin
curl http://localhost:8000/health
```

### CORS Hatası
- API'nin CORS ayarlarını kontrol edin
- Frontend URL'inin izin verilen originler listesinde olduğundan emin olun

### Firebase Hatası
- Service account JSON dosyasının doğru konumda olduğunu kontrol edin
- Firebase proje ayarlarını kontrol edin
- Authentication'ın etkinleştirildiğinden emin olun

### Model Yükleme Hatası
- İnternet bağlantınızı kontrol edin
- Model dosyalarının indirilmesi zaman alabilir
- GPU kullanımı için CUDA kurulu olmalı

## 📁 Proje Yapısı

```
├── patient-assistant-api/          # Backend API
│   ├── app/
│   │   ├── auth/                  # Authentication
│   │   ├── chat/                  # Chat endpoints
│   │   ├── core/                  # Model & Session management
│   │   ├── config/                # Configuration
│   │   └── utils/                 # Utilities
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── client/                        # Frontend React app
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   └── pages/
├── test-integration.js            # Integration test
└── SETUP.md                      # Bu dosya
```

## 🚀 Production Deployment

### Docker ile Deployment

```bash
# Backend
cd patient-assistant-api
docker build -t patient-assistant-api .
docker run -p 8000:8000 patient-assistant-api

# Frontend
cd client
npm run build
# Build edilen dosyaları web sunucusuna yükleyin
```

### Environment Variables (Production)

```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
SECRET_KEY=your-very-secure-secret-key
CORS_ORIGINS=https://yourdomain.com
```

## 📞 Destek

Sorun yaşarsanız:

1. Logları kontrol edin
2. API dokümantasyonunu inceleyin: `http://localhost:8000/docs`
3. Health check endpoint'ini kontrol edin: `http://localhost:8000/health`
4. Integration testini çalıştırın: `node test-integration.js`

## ⚠️ Önemli Notlar

- Bu sistem eğitim amaçlıdır, gerçek tıbbi tanı için kullanmayın
- Firebase ayarlarınızı güvenli tutun
- Production'da güçlü bir SECRET_KEY kullanın
- Model dosyaları büyük olabilir, yeterli disk alanınız olduğundan emin olun 