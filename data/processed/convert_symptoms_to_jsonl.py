import pandas as pd
import json
import os

# Giriş ve çıkış yolları
input_path = "C:/Users/LENOVO/Desktop/patient_assistant/data/raw/clinical_conditions_symptoms/Disease_symptom_and_patient_profile_dataset.csv"
output_path = "processed/clinical_conditions_info.jsonl"

# Klasör yoksa oluştur
os.makedirs("processed", exist_ok=True)

# Belirti sütunları
symptom_columns = ["Fever", "Cough", "Fatigue", "Difficulty Breathing"]

# CSV'yi oku
df = pd.read_csv(input_path)

# Belirtileri liste formatına dönüştür
df["Symptoms"] = df.apply(
    lambda row: [col for col in symptom_columns if row[col] == "Yes"], axis=1
)

# Yaş grubu tanımla
def categorize_age(age):
    if age < 40:
        return "Young"
    elif 40 <= age < 60:
        return "Middle-aged"
    elif 60 <= age < 75:
        return "Senior"
    else:
        return "Elderly"

df["Age_Group"] = df["Age"].apply(categorize_age)
df["Symptoms_Tuple"] = df["Symptoms"].apply(tuple)

# Gereksiz tekrarları temizle
df_clean = df[[
    "Disease", "Symptoms_Tuple", "Age_Group", "Gender", "Blood Pressure", "Cholesterol Level"
]].drop_duplicates()

df_clean["Symptoms"] = df_clean["Symptoms_Tuple"].apply(list)
df_clean = df_clean.drop(columns=["Symptoms_Tuple"])

# İlk 10 hastalık için bilgi kartı oluştur
info_cards = []
for disease in df_clean["Disease"].unique()[:10]:
    data = df_clean[df_clean["Disease"] == disease]
    all_symptoms = sum(data["Symptoms"].tolist(), [])
    common_symptoms = list(set(all_symptoms))[:5]

    card = {
        "disease": disease,
        "symptoms": common_symptoms,
        "common_in": data["Age_Group"].mode()[0],
        "gender_distribution": f"Mostly {data['Gender'].mode()[0]}",
        "risk_factors": [
            data["Blood Pressure"].mode()[0],
            data["Cholesterol Level"].mode()[0]
        ],
        "misconception": f"{disease} genellikle hafif bir durum sanılsa da ciddi sonuçlara yol açabilir.",
        "advice": f"Eğer belirtileriniz {', '.join(common_symptoms)} ise bir doktora danışmanız önerilir."
    }

    info_cards.append(card)

# JSONL formatında kaydet
with open(output_path, "w", encoding="utf-8") as f:
    for card in info_cards:
        json.dump(card, f, ensure_ascii=False)
        f.write("\n")

print(f"{len(info_cards)} bilgi kartı başarıyla '{output_path}' dosyasına yazıldı.")
