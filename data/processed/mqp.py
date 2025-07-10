import pandas as pd
from deep_translator import GoogleTranslator

# Dosyanı oku
df = pd.read_csv("C:\\Users\\LENOVO\\Desktop\\patient_assistant\\data\\raw\\medical_qa\\mqp.csv")

# Sütunları tanımla
question_col = df.columns[1]
answer_col = df.columns[2]

# Çeviri fonksiyonu
def translate_text(text):
    try:
        return GoogleTranslator(source='auto', target='tr').translate(str(text))
    except:
        return text

# Yeni sütunlar
df["question_tr"] = df[question_col].apply(translate_text)
df["answer_tr"] = df[answer_col].apply(translate_text)

# Türkçe çevirileri içeren yeni CSV dosyası
df[["question_tr", "answer_tr"]].to_csv("mqp_translated_tr.csv", index=False, encoding="utf-8-sig")
print("Türkçeye çeviri tamamlandı ve 'mqp_translated_tr.csv' dosyası oluşturuldu.")
