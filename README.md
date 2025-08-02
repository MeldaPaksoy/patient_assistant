# 🏥 Patient Assistant - AI-Powered Healthcare Chatbot

<div align="center">

![Patient Assistant](https://img.shields.io/badge/Patient%20Assistant-AI%20Healthcare-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)


[Demo](#-demo) • [Kurulum](#-kurulum) • [Özellikler](#-özellikler) • [API Docs](#-api-dokümantasyonu) 

</div>

---

## 📋 İçerik Tablosu

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🏗️ Teknoloji Stack](#️-teknoloji-stack)
- [🚀 Kurulum](#-kurulum)
- [📱 Kullanım](#-kullanım)
- [🔧 Konfigürasyon](#-konfigürasyon)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [🏛️ Proje Mimarisi](#️-proje-mimarisi)
---

## 🎯 Proje Hakkında

Patient Assistant, modern web teknolojileri kullanılarak geliştirilmiş AI destekli bir sağlık asistanı uygulamasıdır. Kullanıcılar sağlık sorularını sorabilir, anında yanıtlar alabilir ve güvenli bir ortamda sağlık danışmanlığı hizmeti alabilirler.

### 🌟 Ana Hedefler

- **Erişilebilir Sağlık Danışmanlığı**: 7/24 AI destekli sağlık asistanı
- **Güvenli Platform**: Firebase Authentication ile güvenli kullanıcı yönetimi
- **Modern UX/UI**: React ve Tailwind CSS ile kullanıcı dostu arayüz
- **Çoklu Platform**: Web tabanlı, responsive tasarım

---

## ✨ Özellikler

### 🤖 AI Sağlık Asistanı

- **Akıllı Chatbot**: Google MedGemma-4B-IT modeli ile donatılmış
- **Anında Yanıtlar**: Sağlık sorularına hızlı ve doğru cevaplar
- **Sesli Özellikler**: Text-to-Speech (TTS) desteği
- **Oturum Yönetimi**: Chat geçmişi ve oturum takibi

### 🔐 Güvenlik ve Kimlik Doğrulama

- **Firebase Authentication**: Güvenli giriş/çıkış sistemi
- **Kullanıcı Profilleri**: Kişiselleştirilmiş deneyim
- **Veri Güvenliği**: HTTPS ve güvenli API endpoint'leri

### 🎨 Modern Kullanıcı Arayüzü

- **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- **Dark/Light Theme**: Kullanıcı tercihi tema desteği
- **Component Library**: Radix UI ile tutarlı tasarım
- **Accessibility**: WCAG standartlarına uygun erişilebilirlik

### 📊 Gelişmiş Özellikler

- **Chat History**: Geçmiş konuşmaları görüntüleme
- **Session Management**: Birden fazla chat oturumu
- **Real-time Updates**: Canlı mesajlaşma deneyimi
- **Mobile Responsive**: Mobil uyumlu tasarım

---

## 🏗️ Teknoloji Stack

### Frontend

```
React 18          - Modern UI framework
TypeScript        - Type-safe development
Vite             - Lightning-fast build tool
Tailwind CSS     - Utility-first CSS framework
Radix UI         - Accessible component primitives
React Router     - Client-side routing
Lucide Icons     - Beautiful icon library
```

### Backend

```
FastAPI          - Modern Python web framework
Uvicorn          - Lightning-fast ASGI server
Pydantic         - Data validation and settings
Firebase Admin   - Authentication and security
Transformers     - AI/ML model integration
LangChain        - LLM framework for AI
```

### AI/ML

```
Google MedGemma-4B-IT  - Medical AI model
PyTorch                - Deep learning framework
Transformers           - Model implementation
LangChain              - Memory management
```

### Development Tools

```
ESLint           - Code linting
Prettier         - Code formatting
TypeScript       - Static type checking
Git              - Version control
npm/pip          - Package management
```

---

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/patient-assistant.git
cd patient-assistant
```

### 2. Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Python sanal ortamı oluşturun
python -m venv .venv

# Sanal ortamı aktifleştirin
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Gereksinimleri yükleyin
pip install -r requirements.txt
```

### 3. Frontend Kurulumu

```bash
# Frontend klasörüne gidin (yeni terminal)
cd frontend

# Node bağımlılıklarını yükleyin
npm install
```

### 4. Ortam Değişkenlerini Ayarlayın

Backend klasöründe `.env` dosyası oluşturun:

```env
# Firebase Configuration
API_KEY=your_firebase_api_key
MESSAGING_SENDER_ID=your_sender_id
APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/firebase-admin-sdk.json

# Model Configuration
MODEL_ID=google/medgemma-4b-it
MAX_NEW_TOKENS=512
TEMPERATURE=0.1
```

### 5. Uygulamayı Başlatın

**Backend:**

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

```bash
cd frontend
npm run dev

###BİLGİLENDİRME
'vite' is not recognized as an internal or external command,
operable program or batch file. -> Hatası alınırsa npm install vite --save-dev
ile sorun giderilir.
```

### 6. Uygulamaya Erişin

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📱 Kullanım

### İlk Kullanım

1. **Kayıt Olun**: Ana sayfada "Giriş Yap" butonuna tıklayarak Firebase Authentication ile hesap oluşturun
2. **Chat Başlatın**: "AI Chat" sayfasına giderek sağlık sorularınızı sormaya başlayın
3. **Özellikler**: TTS, chat geçmişi ve profil yönetimi özelliklerini keşfedin

### Chat Özellikleri

- **Soru Sorma**: Sağlık ile ilgili sorularınızı yazın
- **Sesli Okuma**: Bot yanıtlarını sesli dinleyin (TTS)
- **Geçmiş**: Önceki konuşmalarınızı görüntüleyin
- **Oturum Yönetimi**: Birden fazla chat oturumu oluşturun

### Güvenlik

- Tüm veriler şifrelenmiş olarak saklanır
- Firebase Authentication ile güvenli kimlik doğrulama
- API endpoint'leri JWT token ile korunur
- Kullanıcı verileri GDPR uyumlu olarak işlenir

---

## 🔧 Konfigürasyon

### Backend Konfigürasyonu

`backend/app/config/settings.py` dosyasında:

```python
# Model ayarları
MODEL_ID = "google/medgemma-4b-it"
MAX_NEW_TOKENS = 512
TEMPERATURE = 0.1

# API ayarları
CORS_ORIGINS = ["http://localhost:5173"]
```

### Frontend Konfigürasyonu

`frontend/vite.config.ts` dosyasında:

```typescript
// API proxy ayarları
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### Firebase Ayarları

1. Firebase Console'da yeni proje oluşturun
2. Authentication'ı etkinleştirin
3. Service Account anahtarını indirin
4. `.env` dosyasına Firebase bilgilerini ekleyin

---

## 📚 API Dokümantasyonu

### Ana Endpoint'ler

#### Authentication

```
POST /auth/login     - Kullanıcı girişi
POST /auth/register  - Kullanıcı kaydı
POST /auth/logout    - Kullanıcı çıkışı
GET  /auth/profile   - Kullanıcı profili
```

#### Chat

```
POST /chat/message   - Yeni mesaj gönder
GET  /chat/history   - Chat geçmişi
POST /chat/session   - Yeni oturum oluştur
DELETE /chat/session/{id} - Oturum sil
```

## 🏛️ Proje Mimarisi

```
patient-assistant/
├── frontend/                   # React/TypeScript Frontend
│   ├── client/                # React bileşenleri ve logic
│   │   ├── components/        # UI bileşenleri
│   │   │   ├── ui/           # Temel UI componentleri
│   │   │   ├── AuthModal.tsx # Kimlik doğrulama modal
│   │   │   ├── ChatBot.tsx   # Chat bileşeni
│   │   │   └── Header.tsx    # Sayfa başlığı
│   │   ├── pages/            # Sayfa bileşenleri
│   │   │   ├── Index.tsx     # Ana sayfa
│   │   │   ├── AIChat.tsx    # Chat sayfası
│   │   │   ├── Profile.tsx   # Profil sayfası
│   │   │   └── About.tsx     # Hakkında sayfası
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── usePatientAssistant.ts
│   │   │   └── useLLM.ts
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/         # API servisleri
│   │   │   └── patientAssistantApi.ts
│   │   └── lib/              # Yardımcı kütüphaneler
│   │       ├── utils.ts
│   │       └── tts.ts
│   ├── server/               # Express server (production)
│   ├── public/               # Statik dosyalar
│   └── package.json          # Frontend bağımlılıkları
│
├── backend/                   # Python FastAPI Backend
│   ├── app/                  # Ana uygulama
│   │   ├── main.py          # FastAPI uygulaması
│   │   ├── auth/            # Kimlik doğrulama
│   │   │   ├── models.py    # Auth modelleri
│   │   │   ├── routes.py    # Auth endpoint'leri
│   │   │   ├── service.py   # Auth business logic
│   │   │   └── dependencies.py # Auth dependencies
│   │   ├── chat/            # Chat servisleri
│   │   │   ├── models.py    # Chat modelleri
│   │   │   ├── routes.py    # Chat endpoint'leri
│   │   │   └── service.py   # Chat business logic
│   │   ├── core/            # Temel servisler
│   │   │   ├── model_manager.py    # AI model yönetimi
│   │   │   └── session_manager.py  # Oturum yönetimi
│   │   ├── config/          # Konfigürasyon
│   │   │   └── settings.py  # Ayarlar
│   │   └── utils/           # Yardımcı fonksiyonlar
│   │       └── prompts.py   # AI prompt'ları
│   └── requirements.txt      # Python bağımlılıkları
│
├── docs/                     # Dokümantasyon
│   └── STARTUP.md           # Kurulum rehberi
├── .gitignore               # Git ignore kuralları
├── README.md                # Bu dosya
└── package.json              # Ana proje konfigürasyonu
```

### Mimari Prensipler

- **Separation of Concerns**: Frontend ve backend ayrı sorumluluklar
- **Component-Based**: Yeniden kullanılabilir React bileşenleri
- **API-First**: RESTful API tasarımı
- **Security-First**: Güvenlik odaklı geliştirme
- **Scalable**: Ölçeklenebilir mimari yapı

---
