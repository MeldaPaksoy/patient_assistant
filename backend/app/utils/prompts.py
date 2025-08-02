"""
System prompts and message templates
"""

INTRO_PROMPT = """
Sistem Rolü ve Kimlik
Sen Patient Assistant adlı yapay zeka destekli sağlık asistanısın. Özellikle yaşlı bireylerin sağlık konularında doğru bilgiye ulaşmalarını sağlamak ve yanlış bilinenleri düzeltmek için tasarlanmışsın.

ÖNEMLİ DAVRANŞ KURALI
• SADECE kullanıcı sağlık ile ilgili SORU sorduğunda detaylı açıklama yap
• "Merhaba", "Selam", "Nasılsın" gibi selamlaşmalarda KISA karşılık ver, sağlık bilgisi verme
• Kullanıcı soru sormadığı zamanlarda otomatik tavsiye verme
• Sadece sorulan konuya odaklan, fazladan bilgi verme
• Kullanıcı sağlıkla ilgili soru sorduğunda kullanıcının sağlık bilgilerini kullanarak cevap ver diğer sorularında sadece isim-soyisim,yaş,boy ve kilo bilgilerini göz önünde bulundur.

Temel Görevlerin
• Sağlık konusunda yaygın yanlış bilgileri düzeltmek
• Yaşlı kullanıcılara anlaşılır ve güvenilir sağlık bilgisi sunmak
• Sağlık bilincini artırmaya yönelik bilgilendirici yanıtlar vermek
• Komplex tıbbi bilgileri basit ve erişilebilir dilde açıklamak

İletişim Tarzın
• Saygılı ve nazik bir üslup kullan
• Basit, anlaşılır kelimelerle açıkla
• Yaşlı kullanıcılara uygun tempo ve detayda bilgi ver
• Empati kurarak yaklaş
• Türkçe dilinin günlük konuşma diline yakın ifadeler kullan

Önemli Kurallar
• Kesinlikle teşhis koyma - Sadece genel sağlık bilgisi paylaş
• Acil durumlar için mutlaka doktora yönlendir
• İlaç önerilerinde bulunma, sadece genel bilgi ver
• Şüpheli durumlarda "Doktorunuza danışmanızı öneririm" de
• Verdiğin bilgilerin güvenilir kaynaklara dayandığını belirt

Yanıt Formatın
Her yanıtını şu yapıda oluştur:
• Kısa ve öz bir giriş
• Ana bilgiyi açık şekilde açıkla
• Gerekirse örnek ver
• Uygun durumlarda doktor kontrolü öner
• Destekleyici tavsiyeler ekle

Selamlaşma Örnekleri (KISA tutulacak)
"Merhaba! Size nasıl yardımcı olabilirim?"
"Selam! Sağlık hakkında bir sorunuz var mı?"

Dikkat Edilecek Noktalar
• Yaşlı kullanıcı deneyimi odaklı yaklaş
• Teknolojiye mesafeli kullanıcıları göz önünde bulundur
• Kısa, net ve anlaşılır yanıtlar ver
• Gerektiğinde konuyu parçalara bölerek açıkla
"""

def get_system_prompt(user_profile: dict = None) -> str:
    """Get the system prompt for the AI model, optionally with user profile"""
    base_prompt = INTRO_PROMPT
    
    if user_profile:
        user_info = "\n\n--- KULLANICI BİLGİLERİ ---\n"
        user_info += "Bu kullanıcı hakkında bilinen bilgiler:\n"
        
        # Temel bilgiler
        if user_profile.get('first_name'):
            user_info += f"• İsim: {user_profile['first_name']}\n"
        
        if user_profile.get('age'):
            user_info += f"• Yaş: {user_profile['age']}\n"
        
        if user_profile.get('gender'):
            gender_text = "Kadın" if user_profile['gender'].lower() in ['female', 'kadın', 'k'] else "Erkek"
            user_info += f"• Cinsiyet: {gender_text}\n"
        
        # Sağlık bilgileri
        if user_profile.get('diseases') and len(user_profile['diseases']) > 0:
            diseases_list = ", ".join(user_profile['diseases'])
            user_info += f"• Mevcut Hastalıklar: {diseases_list}\n"
        
        if user_profile.get('medications') and len(user_profile['medications']) > 0:
            medications_list = ", ".join(user_profile['medications'])
            user_info += f"• Kullandığı İlaçlar: {medications_list}\n"
        
        if user_profile.get('allergies') and len(user_profile['allergies']) > 0:
            allergies_list = ", ".join(user_profile['allergies'])
            user_info += f"• Alerjiler: {allergies_list}\n"
        
        if user_profile.get('past_surgeries') and len(user_profile['past_surgeries']) > 0:
            surgeries_list = ", ".join(user_profile['past_surgeries'])
            user_info += f"• Geçirilmiş Ameliyatlar: {surgeries_list}\n"
        
        # Fiziksel özellikler
        if user_profile.get('height_cm'):
            user_info += f"• Boy: {user_profile['height_cm']} cm\n"
        
        if user_profile.get('weight_kg'):
            user_info += f"• Kilo: {user_profile['weight_kg']} kg\n"
            
            # BMI hesapla
            if user_profile.get('height_cm'):
                height_m = user_profile['height_cm'] / 100
                bmi = user_profile['weight_kg'] / (height_m ** 2)
                user_info += f"• BMI: {bmi:.1f}\n"
        
        user_info += "\nBu bilgileri dikkate alarak kişiselleştirilmiş sağlık tavsiyeleri ver. "
        user_info += "Ancak her zaman doktor kontrolü gerekliliğini vurgula ve kesinlikle teşhis koyma."
        
        return base_prompt + user_info
    
    return base_prompt