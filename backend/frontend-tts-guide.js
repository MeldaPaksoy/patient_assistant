/**
 * Patient Assistant - Text-to-Speech Implementation
 * Modern ve mantıklı TTS çözümü
 */

class PatientTTS {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.currentUtterance = null;
        this.isPlaying = false;
        
        // Türkçe için optimize edilmiş ayarlar
        this.settings = {
            lang: 'tr-TR',
            rate: 0.8,     // %80 hız (daha anlaşılır)
            pitch: 1,      // Normal ton
            volume: 0.9    // %90 ses seviyesi
        };
    }

    /**
     * Ana TTS fonksiyonu - Chat mesajlarını seslendirir
     * @param {string} text - Okunacak metin
     * @param {function} onUpdate - UI güncelleme callback'i
     * @returns {boolean} - Başarı durumu
     */
    speak(text, onUpdate = null) {
        // Tarayıcı desteği kontrolü
        if (!this.isSupported) {
            console.warn('Bu tarayıcı sesli okuma desteklemiyor');
            if (onUpdate) onUpdate('unsupported');
            return false;
        }

        // Önceki konuşmayı durdur
        this.stop();

        // Metni temizle
        const cleanText = this._cleanText(text);
        if (!cleanText) {
            console.warn('Okunacak metin boş');
            return false;
        }

        // SpeechSynthesisUtterance oluştur
        this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        Object.assign(this.currentUtterance, this.settings);

        // Event handlers
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            if (onUpdate) onUpdate('playing');
        };

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            this.currentUtterance = null;
            if (onUpdate) onUpdate('finished');
        };

        this.currentUtterance.onerror = (event) => {
            this.isPlaying = false;
            this.currentUtterance = null;
            console.error('TTS Hatası:', event);
            if (onUpdate) onUpdate('error');
        };

        // Konuşmayı başlat
        speechSynthesis.speak(this.currentUtterance);
        return true;
    }

    /**
     * Konuşmayı durdur
     */
    stop() {
        if (this.isPlaying || speechSynthesis.speaking) {
            speechSynthesis.cancel();
            this.isPlaying = false;
            this.currentUtterance = null;
        }
    }

    /**
     * Metni temizle (HTML, fazla boşluk vs.)
     * @param {string} text 
     * @returns {string}
     */
    _cleanText(text) {
        return text
            .replace(/<[^>]*>/g, '') // HTML tagları
            .replace(/&[^;]+;/g, ' ') // HTML entities
            .replace(/\s+/g, ' ') // Fazla boşluklar
            .trim();
    }

    /**
     * TTS durumu
     * @returns {object}
     */
    getStatus() {
        return {
            isSupported: this.isSupported,
            isPlaying: this.isPlaying
        };
    }
}

// Global TTS instance
const tts = new PatientTTS();

/**
 * Chat mesajına TTS butonu ekle
 * @param {HTMLElement} messageElement 
 */
function addTTSButton(messageElement) {
    const messageText = messageElement.querySelector('.message-content')?.textContent;
    if (!messageText) return;

    const button = document.createElement('button');
    button.className = 'tts-button';
    button.innerHTML = '🔊';
    button.title = 'Sesli oku';
    button.style.cssText = `
        background: none;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 8px;
        transition: all 0.2s;
    `;

    // TTS durumuna göre buton görünümü
    const updateButton = (status) => {
        switch(status) {
            case 'playing':
                button.innerHTML = '🔇';
                button.title = 'Durdur';
                button.style.backgroundColor = '#e3f2fd';
                button.onclick = () => tts.stop();
                break;
            case 'finished':
            case 'error':
            case 'unsupported':
                button.innerHTML = '🔊';
                button.title = status === 'unsupported' ? 'Desteklenmiyor' : 'Sesli oku';
                button.style.backgroundColor = '';
                button.disabled = status === 'unsupported';
                button.onclick = () => tts.speak(messageText, updateButton);
                break;
        }
    };

    // İlk durumu ayarla
    updateButton(tts.isSupported ? 'finished' : 'unsupported');

    // Butonu message actions alanına ekle
    let actionsContainer = messageElement.querySelector('.message-actions');
    if (!actionsContainer) {
        actionsContainer = document.createElement('div');
        actionsContainer.className = 'message-actions';
        actionsContainer.style.cssText = 'margin-top: 8px; text-align: right;';
        messageElement.appendChild(actionsContainer);
    }
    
    actionsContainer.appendChild(button);
}

/**
 * Chat API entegrasyonu - mesaj gönder ve TTS ekle
 * @param {string} message 
 * @param {string} token 
 */
async function sendChatWithTTS(message, token) {
    try {
        const response = await fetch('/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Chat UI'sine mesajı ekle
        const messageElement = addMessageToChat(data.response, 'assistant');
        
        // TTS butonunu ekle
        addTTSButton(messageElement);
        
        return data;

    } catch (error) {
        console.error('Chat API Hatası:', error);
        throw error;
    }
}

/**
 * Chat UI'sine mesaj ekle
 * @param {string} message 
 * @param {string} sender 
 * @returns {HTMLElement}
 */
function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) {
        console.error('Chat container bulunamadı');
        return null;
    }

    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;

    // Stil ekle
    messageElement.style.cssText = `
        margin: 10px 0;
        padding: 12px;
        border-radius: 8px;
        max-width: 80%;
        ${sender === 'assistant' ? 
            'background-color: #f8f9fa; margin-left: 20px;' : 
            'background-color: #e8f5e8; margin-right: 20px; margin-left: auto;'
        }
    `;

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return messageElement;
}

// CSS stilleri otomatik ekle
if (!document.getElementById('tts-styles')) {
    const styles = document.createElement('style');
    styles.id = 'tts-styles';
    styles.textContent = `
        .chat-message {
            position: relative;
        }
        .tts-button:hover:not(:disabled) {
            background-color: #e3f2fd !important;
            border-color: #2196f3;
        }
        .tts-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        #chat-container {
            max-height: 500px;
            overflow-y: auto;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(styles);
}

// Export (ES6 modülleri için)
if (typeof module !== 'undefined') {
    module.exports = { PatientTTS, addTTSButton, sendChatWithTTS };
}

/* 
===============================
KULLANIM ÖRNEKLERİ
===============================

// 1. Basit kullanım
tts.speak("Merhaba, nasılsın?");

// 2. Chat mesajı ile
const messageDiv = document.querySelector('.chat-message');
addTTSButton(messageDiv);

// 3. API ile entegre
sendChatWithTTS("Başım ağrıyor", userToken)
    .then(response => console.log('Mesaj gönderildi:', response))
    .catch(error => console.error('Hata:', error));

// 4. HTML örneği
/*
<div id="chat-container"></div>
<div class="chat-input">
    <input type="text" id="messageInput" placeholder="Mesajınızı yazın...">
    <button onclick="sendMessage()">Gönder</button>
</div>

<script>
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        sendChatWithTTS(message, 'your-auth-token');
        input.value = '';
    }
}
</script>
*/
