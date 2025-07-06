# Patient Assistant – 28 Günlük Veri Bilimci Görev Planı

Bu döküman, 2 veri bilimcisinin 4 haftalık proje süresince üstleneceği görevleri haftalık olarak sıralar. Görevler paralel ve artan sorumluluklarla uyumludur.

## Roller
- **Veri Bilimci A**: Veri temizleme, analiz, FHIR uyumlu yapı, semptom eşleştirme, kullanıcı analizleri  
- **Veri Bilimci B**: Veritabanı tasarımı, NLP eğitim verisi, RAG vektör verisi hazırlığı, klinik protokol modelleme

---

## Hafta – Hazırlık ve Altyapı (Gün 1–7)

| Gün | Görev                                                                                       | Sorumlu |
|-----|---------------------------------------------------------------------------------------------|---------|
| 1   | Proje tanımı, görev paylaşımı, kavramsal veri akış şeması çizimi                           | A + B   |
| 2   | Klinik veri kaynaklarının araştırılması (semptom, tanı, vital bulgular, testler)           | A       |
| 3   | Veritabanı şeması tasarımı (hasta, semptom, test, konuşma, risk puanı vb.)                 | B       |
| 4   | JSON/CSV formatında örnek hasta verisi oluşturulması                                       | A       |
| 5   | FHIR uyumlu veri alanlarının çıkarılması ve eşleştirme                                     | A       |
| 6   | PostgreSQL veya MongoDB kurulumu ve bağlantı testleri                                      | B       |
| 7   | Arayüz ve backend ile veri bağlantısı testlerinin yapılması                                | A + B   |

---

## Hafta – Veri Hazırlama, Temizlik ve NLP Desteği (Gün 8–14)

| Gün | Görev                                                                                       | Sorumlu |
|-----|---------------------------------------------------------------------------------------------|---------|
| 8   | MedQuAD veya benzeri veri setinden soruların analiz edilmesi                               | A       |
| 9   | Monant / CoAID gibi kaynaklardan yanlış bilgi tespiti veri setinin ön işlenmesi            | B       |
| 10  | Soruların sınıflandırılması (semptom / tedavi / bilgi / riskli)                            | A       |
| 11  | NLP modelleri için etiketli veri dosyası hazırlanması (intent classification)              | A       |
| 12  | Vektör veritabanı (ChromaDB) için uygun metinlerin seçilmesi ve ön işlenmesi               | B       |
| 13  | Klinik bilgi kartlarının Markdown / JSON formatında yapılandırılması                       | A       |
| 14  | LangChain ve Gemini ile veri setlerinin uyumluluğunun test edilmesi                        | B       |

---

##  Hafta – Klinik Protokol Modülü & Risk Skorları (Gün 15–21)

| Gün | Görev                                                                                       | Sorumlu |
|-----|---------------------------------------------------------------------------------------------|---------|
| 15  | Riskli semptomların listelenmesi (örneğin göğüs ağrısı, ani bilinç kaybı)                   | A       |
| 16  | Risk değerlendirme formülü veya modeli tasarlanması (semptom puanlama)                      | A       |
| 17  | FHIR verisiyle semptom eşleştirme senaryolarının hazırlanması                              | A       |
| 18  | Klinik protokollerin (hipertansiyon, diyabet vb.) yapılandırılmış veri haline getirilmesi  | B       |
| 19  | Klinik protokol → öneri → uyarı zincirinin JSON / Mongo formatına aktarılması              | B       |
| 20  | Arayüzle entegre edilmiş protokol görselleri ve metinlerin test edilmesi                   | A + B   |
| 21  | Vektör veri arama sistemi (RAG) için embedding + arama testlerinin yapılması               | B       |

---

## Hafta – Test, Analiz, Görselleştirme ve Raporlama (Gün 22–28)

| Gün | Görev                                                                                       | Sorumlu |
|-----|---------------------------------------------------------------------------------------------|---------|
| 22  | Sistemden gelen konuşma verilerinin analizi                                                | B       |
| 23  | Sık sorulan soruların frekans analizi ve sınıflandırma performansı                         | A       |
| 24  | Kullanıcı profiline göre öneri türlerinin analizi                                          | A       |
| 25  | Yanlış bilgiye karşı önerilerin doğruluğunun değerlendirilmesi                             | B       |
| 26  | Sistem önerilerinin medikal veriyle doğruluk karşılaştırması                               | A       |
| 27  | Final raporlar, tablolar, grafikler, veri yedeklerinin hazırlanması                         | A + B   |
| 28  | Sunum, grafik, PDF ve dokümantasyonun Notion ve GitHub’a aktarılması                       | A + B   |

---



