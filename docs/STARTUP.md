# 🚀 Patient Assistant - Kurulum ve Çalıştırma Rehberi

Bu proje, AI destekli hasta asistanı uygulamasıdır. React/TypeScript frontend ve Python FastAPI backend içerir.

## 📂 Proje Yapısı

```
patient-assistant/
├── frontend/              # React/TypeScript frontend
├── backend/               # Python FastAPI backend
├── docs/                  # Dokümantasyon
└── package.json           # Ana proje konfigürasyonu
```

## 🎯 Kurulum ve Çalıştırma

### 1. Backend Kurulumu (Python FastAPI)

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

# Backend'i başlatın
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Kurulumu (React/TypeScript)

Yeni bir terminal açın:

```bash
# Frontend klasörüne gidin
cd frontend

# Node bağımlılıklarını yükleyin
npm install

# Frontend'i başlatın
npm run dev
```

## 🌐 Erişim Adresleri

Her iki servis çalıştıktan sonra:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Dokümantasyonu:** http://localhost:8000/docs
- **API Redoc:** http://localhost:8000/redoc

## 🛠️ Gereksinimler

- **Node.js:** 16.0.0 veya üzeri
- **Python:** 3.8.0 veya üzeri
- **npm:** Node.js ile birlikte gelir
- **pip:** Python ile birlikte gelir

## 🚀 Hızlı Başlatma (İsteğe Bağlı)

Ana klasörden her iki servisi birlikte başlatmak için:

```bash
# Ana klasöre gidin
cd patient-assistant

# Concurrently paketini yükleyin (sadece bir kez)
npm install

# Her iki servisi birlikte başlatın
npm run dev
```

## 🚨 Sorun Giderme

### Python Sanal Ortamı Aktifleştirme:

**Windows:**

```cmd
cd backend
.venv\Scripts\activate
```

**Linux/Mac:**

```bash
cd backend
source .venv/bin/activate
```

### Port Çakışması:

- Backend API: Port 8000
- Frontend: Port 5173
- Bu portlar meşgulse otomatik olarak başka portlar seçilir

### Bağımlılık Sorunları:

**Python paketleri:**

```bash
cd backend
pip install -r requirements.txt
```

**Node paketleri:**

```bash
cd frontend
npm install
```

## 📁 Proje Mimarisi

```
patient-assistant/
├── frontend/                   # React/TypeScript Frontend
│   ├── client/                # React bileşenleri ve logic
│   │   ├── components/        # UI bileşenleri
│   │   ├── pages/            # Sayfa bileşenleri
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # React contexts (Auth vs.)
│   │   └── services/         # API servisleri
│   ├── server/               # Express server (production)
│   ├── public/               # Statik dosyalar (favicon, etc.)
│   └── package.json          # Frontend bağımlılıkları
│
├── backend/                   # Python FastAPI Backend
│   ├── app/                  # Ana uygulama
│   │   ├── auth/            # Kimlik doğrulama servisleri
│   │   ├── chat/            # Chat ve AI servisleri
│   │   ├── core/            # Temel servisler (model manager vs.)
│   │   ├── config/          # Konfigürasyon ayarları
│   │   └── utils/           # Yardımcı fonksiyonlar
│   └── requirements.txt      # Python bağımlılıkları
│
├── docs/                     # Dokümantasyon dosyaları
├── .gitignore               # Git ignore kuralları
└── package.json              # Ana proje konfigürasyonu
```

## � Teknoloji Stack

### Frontend:

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **Tailwind CSS** - Styling
- **Radix UI** - UI component library

### Backend:

- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Firebase** - Authentication
- **Transformers** - AI/ML models

---

**🎉 Kurulum tamamlandı! Backend ve Frontend'i ayrı terminallerde çalıştırın.**
