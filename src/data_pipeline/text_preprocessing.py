# src/data_pipeline/text_preprocessing.py içeriği

import re
import nltk
from nltk.corpus import stopwords
# NLTK WordNetLemmatizer için gereklidir
from nltk.stem import WordNetLemmatizer

# NLTK verilerini indirme (sadece bir kez çalıştırılması yeterlidir)
# Bu fonksiyonu, bu modülü kullanmadan önce veya bir kurulum betiğinde çağırabilirsiniz.
# Her zaman indirilmiş mi diye kontrol etmek için try-except bloğu kullanabiliriz.
def download_nltk_data():
    try:
        nltk.data.find('corpora/stopwords')
    except nltk.DownloadError: # DEĞİŞTİRİLDİ
        print("NLTK stopwords indiriliyor...")
        nltk.download('stopwords')
        print("NLTK stopwords indirildi.")

    try:
        nltk.data.find('corpora/wordnet')
    except nltk.DownloadError: # DEĞİŞTİRİLDİ
        print("NLTK wordnet indiriliyor...")
        nltk.download('wordnet')
        print("NLTK wordnet indirildi.")

    try:
        nltk.data.find('taggers/averaged_perceptron_tagger')
    except nltk.DownloadError: # DEĞİŞTİRİLDİ
        print("NLTK averaged_perceptron_tagger indiriliyor...")
        nltk.download('averaged_perceptron_tagger')
        print("NLTK averaged_perceptron_tagger indirildi.")

# Lemmatizer ve stopword listesini global olarak tanımlayalım, her çağrıda yeniden oluşturmamak için
lemmatizer = WordNetLemmatizer()
english_stopwords = set(stopwords.words('english'))
# Türkçe stopword'ler için şimdilik yerleşik bir NLTK listesi yok.
# Eğer Türkçe veri işleyecekseniz, buradan özel bir liste ekleyebilirsiniz:
# turkish_stopwords = set([... kendi Türkçe stopword listeniz ...])


def lowercase_text(text):
    """Metni küçük harfe çevirir."""
    return text.lower()

def remove_punctuation_and_numbers(text):
    """Metinden noktalama işaretlerini ve sayıları kaldırır."""
    # Noktalama işaretlerini ve sayıları boşlukla değiştirir
    text = re.sub(r'[^\w\s]', ' ', text) # Noktalama işaretleri hariç tüm non-word karakterleri boşluğa çevir
    text = re.sub(r'\d+', ' ', text)     # Sayıları boşluğa çevir
    return text

def remove_extra_spaces(text):
    """Metindeki birden fazla boşluğu tek boşluğa indirir ve baştaki/sondaki boşlukları kaldırır."""
    return re.sub(r'\s+', ' ', text).strip()

def remove_stopwords(text, lang='english'):
    """Metinden stopword'leri (durdurma kelimeleri) kaldırır."""
    words = text.split()
    if lang == 'english':
        filtered_words = [word for word in words if word not in english_stopwords]
    # elif lang == 'turkish':
    #     filtered_words = [word for word in words if word not in turkish_stopwords]
    else:
        filtered_words = words # Belirtilen dilde stopword yoksa veya desteklenmiyorsa olduğu gibi bırak
    return ' '.join(filtered_words)

def lemmatize_text(text, lang='english'):
    """Metindeki kelimeleri kök hallerine getirir (lemmatization)."""
    words = text.split()
    if lang == 'english':
        lemmatized_words = [lemmatizer.lemmatize(word) for word in words]
    # elif lang == 'turkish':
    #     # Türkçe lemmatization için Zeyrek veya başka bir kütüphane entegre edilmeli
    #     # Örnek: from zeyrek import MorphAnalyzer; analyzer = MorphAnalyzer()
    #     # lemmatized_words = [analyzer.lemmatize(word)[0].lemma for word in words]
    else:
        lemmatized_words = words # Belirtilen dilde lemmatization yoksa veya desteklenmiyorsa olduğu gibi bırak
    return ' '.join(lemmatized_words)

def preprocess_text(text, remove_stopwords_flag=True, lemmatize_flag=True, lang='english'):
    """Tüm ön işleme adımlarını uygulayan ana fonksiyon."""
    if not isinstance(text, str):
        return "" # Metin olmayan değerler için boş döndür

    text = lowercase_text(text)
    text = remove_punctuation_and_numbers(text)
    text = remove_extra_spaces(text)

    if remove_stopwords_flag:
        text = remove_stopwords(text, lang=lang)
        text = remove_extra_spaces(text) # Stopword kaldırma sonrası oluşabilecek fazla boşlukları temizle

    if lemmatize_flag:
        text = lemmatize_text(text, lang=lang)
        text = remove_extra_spaces(text) # Lemmatization sonrası oluşabilecek fazla boşlukları temizle

    return text

if __name__ == "__main__":
    # Bu bölüm, sadece bu dosyayı doğrudan çalıştırdığınızda test amaçlı çalışır.
    # Genellikle bu modül diğer betikler tarafından import edilir.
    download_nltk_data() # Gerekli NLTK verilerini indir
    sample_text = "This is an example text for preprocessing. It contains numbers like 123 and some punctuation!"
    processed_sample = preprocess_text(sample_text)
    print(f"Orijinal Metin: {sample_text}")
    print(f"İşlenmiş Metin: {processed_sample}")

    sample_text_turkish = "Bu bir örnek Türkçe cümledir. Sayılar 123 ve noktalama işaretleri var!"
    # Şu an için Türkçe stopword/lemmatization desteklenmiyor.
    processed_sample_turkish = preprocess_text(sample_text_turkish, lang='english') # İngilizce kurallarla işler
    print(f"Orijinal Türkçe Metin: {sample_text_turkish}")
    print(f"İşlenmiş Türkçe Metin (İngilizce kurallarla): {processed_sample_turkish}")