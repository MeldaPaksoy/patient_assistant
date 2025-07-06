# Patient Assistant - Veritabanı Şeması Tasarımı (ERD)

Bu belge, Patient Assistant uygulamasının temel veri yapısını ve varlıklar arasındaki ilişkileri gösteren Varlık-İlişki Diyagramını (ERD) içermektedir. Bu şema, projedeki verilerin nasıl depolanacağını, organize edileceğini ve entegre edileceğini anlamak için kritik bir referanstır.

```mermaid
erDiagram
    PATIENTS ||--o{ SYMPTOMS : has
    PATIENTS ||--o{ VITAL_SIGNS : has
    PATIENTS ||--o{ LAB_TESTS : has
    PATIENTS ||--o{ CONVERSATION_LOGS : interacts_with
    PATIENTS ||--o{ RISK_SCORES : has

    PATIENTS {
        VARCHAR patient_id PK
        INT age
        VARCHAR gender
        TEXT contact_info
    }

    SYMPTOMS {
        VARCHAR symptom_id PK
        VARCHAR symptom_name
        TEXT description
    }

    VITAL_SIGNS {
        VARCHAR vital_sign_id PK
        VARCHAR patient_id FK
        VARCHAR blood_pressure
        INT heart_rate
        FLOAT temperature
        DATETIME record_date
    }

    LAB_TESTS {
        VARCHAR test_id PK
        VARCHAR patient_id FK
        VARCHAR test_name
        VARCHAR value
        VARCHAR unit
        DATETIME test_date
    }

    CONVERSATION_LOGS {
        VARCHAR log_id PK
        VARCHAR patient_id FK
        TEXT conversation_text
        TEXT ai_response_text
        DATETIME timestamp
    }

    RISK_SCORES {
        VARCHAR score_id PK
        VARCHAR patient_id FK
        FLOAT risk_score
        VARCHAR score_category
        DATETIME score_date
    }

    DIAGNOSES {
        VARCHAR diagnosis_id PK
        VARCHAR diagnosis_name
        TEXT description
    }

    PATIENT_DIAGNOSES ||--o{ PATIENTS : has
    PATIENT_DIAGNOSES ||--o{ DIAGNOSES : has

    PATIENT_DIAGNOSES {
        VARCHAR patient_id FK
        VARCHAR diagnosis_id FK
        DATETIME diagnosis_date
    }

    CLINICAL_PROTOCOLS {
        VARCHAR protocol_id PK
        VARCHAR protocol_name
        TEXT protocol_details_json_or_text
        VARCHAR condition_mapped_to
    }

    MISINFORMATION {
        VARCHAR misinformation_id PK
        TEXT misinformation_claim
        TEXT factual_correction
        VARCHAR topic
    }
