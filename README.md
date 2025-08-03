#  Patient Assistant 

## Ar-Ge Aşaması: Veri Derleme, Ön İşleme ve QA Altyapısı

Bu branch, projenin temelini oluşturan veri hazırlığı, soru-cevap (QA) veri setlerinin işlenmesi, ve RAG tabanlı altyapı testleri gibi önemli Ar-Ge adımlarını içermektedir.

## Medikal Veri Derlemesi ve Düzenlenmesi
Farklı açık kaynaklardan ve literatürden edinilen medikal içerikler bir araya getirilmiş; bu veriler arasında şunlar yer almaktadır:

- Klinik vaka açıklamaları
- Hasta profilleri (yaş, cinsiyet, geçmiş tıbbi durumlar)
- Semptom, teşhis ve tedavi verileri
- Laboratuvar test sonuçları

Bu veriler, proje kapsamında geliştirilecek QA sisteminin bilgi temeli için normalize edilmiştir.


## Proje Dosya Yapısı

Bu bölüm, projenin bu branch’ine ait dosya ve klasörlerin genel yapısını özetlemektedir.

```bash
.
├── data/
│   ├── json/
│   │   ├── MedTurkQuAD.json
│   │   ├── fine_tune_qa.py
│   │   ├── test.json
│   │   ├── train.json
│   │   └── validation.json
│   ├── jsonl/
│   │   ├── clinical_conditions_info.jsonl
│   │   ├── data.jsonl
│   │   ├── fact_db.py
│   │   ├── medquad_qa.jsonl
│   │   ├── question.jsonl
│   │   └── sss_db.py
│   ├── processed/
│   │   ├── convert_symptoms_to_jsonl.ipynb
│   │   ├── convert_symptoms_to_jsonl.py
│   │   ├── convert_to_jsonl.py
│   │   ├── disease_predictor.ipynb
│   │   ├── medical.ipynb
│   │   ├── mqp.py
│   │   └── translate.ipynb
│   ├── raw/
│   │   ├── clinical_conditions_symptoms/
│   │   │   ├── Disease precaution.csv
│   │   │   ├── DiseaseAndSymptoms.csv
│   │   │   ├── Disease_symptom_and_patient_profile_dataset.csv
│   │   │   └── healthcare_dataset.csv
│   │   ├── emergency_protocols/
│   │   │   ├── Hospital ER_Data.csv
│   │   │   ├── s41598-020-73558-3_sepsis_survival_primary_cohort.csv
│   │   │   ├── s41598-020-73558-3_sepsis_survival_study_cohort.csv
│   │   │   └── s41598-020-73558-3_sepsis_survival_validation_cohort.csv
│   │   ├── lab_tests_vital_signs/
│   │   │   ├── Dataset for People for their Blood Glucose Level with their Superficial body feature readings..xlsx
│   │   │   ├── Medicaldataset.csv
│   │   │   ├── arterial_disease_and_IBD_EHRs_from_France.csv
│   │   │   ├── heartrate.csv
│   │   │   ├── skin_temperature.csv
│   │   │   └── spo2.csv
│   │   ├── medical_qa/
│   │   │   ├── All-2479-Answers-retrieved-from-MedQuAD.csv
│   │   │   └── mqp.csv
│   │   ├── nlp_dialogue_datasets/
│   │   │   └── medquad.csv
│   │   └── patient_history_demographics/
│   │       ├── cardio_train.csv
│   │       ├── hospital_data_sampleee.xlsx
│   │       └── hospital_records_2021_2024_with_bills.csv
│
├── docs/
│   ├── data_dictionary.md
│   ├── data_science_plan.md
│   ├── database_schema.md
│   └── project_status_summary.md
│
├── notebooks/
│   └── medquad_preprocessing.ipynb
│
├── rag/
│   ├── embedder.py
│   ├── main.py
│   ├── rag_pipeline.py
│   └── retriever.py
│
├── src/
│   └── data_pipeline/
│       ├── process_medquad_data.py
│       └── text_preprocessing.py
│
├── python/
│
├── .gitattributes
├── .gitignore
├── README.md
└── requirements.txt

## 🚀 Kullanılan Teknolojiler


