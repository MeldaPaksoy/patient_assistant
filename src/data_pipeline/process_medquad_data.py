# src/data_pipeline/process_medquad_data.py içeriği

import pandas as pd
import os
# text_preprocessing.py dosyasındaki fonksiyonları import ediyoruz
from text_preprocessing import preprocess_text, download_nltk_data

def process_medquad_data(input_file_path, output_file_path):
    """
    MedQuAD veri setini yükler, metin sütunlarını ön işler ve işlenmiş veriyi kaydeder.
    """
    print(f"'{input_file_path}' dosyasını işlemeye başlıyorum...")

    try:
        df = pd.read_csv(input_file_path)
        print(f"'{input_file_path}' başarıyla okundu. Toplam {len(df)} kayıt.")
    except FileNotFoundError:
        print(f"Hata: '{input_file_path}' bulunamadı. Lütfen dosya yolunu kontrol edin.")
        return

    # 'Question' ve 'Answer' sütunlarını ön işleme tabi tut
    # MedQuAD veri setinde bu sütunlar genellikle bulunur.
    if 'Question' in df.columns and 'Answer' in df.columns:
        print("Question ve Answer sütunları üzerinde ön işleme yapılıyor...")
        df['processed_question'] = df['Question'].apply(preprocess_text)
        df['processed_answer'] = df['Answer'].apply(preprocess_text)

        # Sadece işlenmiş sütunları ve varsa 'focus_area' gibi ilgili sütunları seçebiliriz
        # MedQuAD'ın orijinal sütun yapısına göre bu kısmı ayarlayabilirsiniz.
        # Şimdilik sadece işlenmiş Question ve Answer'ı alalım.
        processed_df = df[['processed_question', 'processed_answer']].copy()
    else:
        print("Uyarı: 'Question' veya 'Answer' sütunları bulunamadı. Lütfen dosyanın içeriğini kontrol edin.")
        # Eğer dosya farklı bir yapıdaysa, hangi sütunları işleyeceğinizi burada belirlemelisiniz.
        return


    # Çıktı dizininin var olduğundan emin olun
    output_dir = os.path.dirname(output_file_path)
    os.makedirs(output_dir, exist_ok=True)

    # İşlenmiş veriyi yeni bir CSV dosyasına kaydet
    processed_df.to_csv(output_file_path, index=False)
    print(f"İşlenmiş veri '{output_file_path}' konumuna kaydedildi.")

if __name__ == "__main__":
    # Bu kısım, 'process_medquad_data.py' dosyasını doğrudan çalıştırdığınızda devreye girer.
    print("Script doğrudan çalıştırılıyor...")

    # NLTK verilerini indirin (sadece bir kez indirilecektir)
    download_nltk_data()

    # Input ve output dosya yollarını belirtin
    # Bu yollar, script'i projenin kök dizininden çalıştırırken doğru olmalıdır.
    # Örneğin: python src/data_pipeline/process_medquad_data.py
    input_path = 'data/raw/nlp_dialogue_datasets/medquad.csv'
    output_path = 'data/processed/nlp_dialogue/processed_medquad.csv'

    process_medquad_data(input_path, output_path)
    print("Veri işleme tamamlandı.")