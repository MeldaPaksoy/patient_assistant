from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from embedder import Embedder
from retriever import Retriever
from rag_pipeline import RAGPipeline

# 1. Embedder oluştur
embedder = Embedder()

# 2. Örnek corpus (bilgi metinleri)
corpus = [
    "Reflü hastalığında genellikle mide yanması ve yemek sonrası rahatsızlık hissi görülür.",
    "Dengue hastalığında genellikle yüksek ateş, kas ağrıları ve şiddetli baş ağrısı olur.",
    "Hipotiroidizmde stres azaltılmalı, düzenli egzersiz yapılmalı ve sağlıklı beslenilmelidir.",
    "Migren hastalarında meditasyon yapmak, stresi azaltmak ve güneşte polarize gözlük kullanmak faydalıdır.",
    "Pneumonia için doktor kontrolü, ilaç tedavisi, dinlenme ve takip önerilir."
]

# 3. Corpus'u embedle
corpus_embeddings = embedder.embed(corpus)

# 4. Retriever oluştur ve corpus'u ekle
retriever = Retriever(embedding_dim=corpus_embeddings.shape[1])
retriever.add_corpus(corpus_embeddings, corpus)

# 5. QA modeli yükle (Türkçe medikal QA)
model_name = "kaixkhazaki/turkish-medical-question-answering"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForQuestionAnswering.from_pretrained(model_name)
qa_pipeline = pipeline("question-answering", model=model, tokenizer=tokenizer)

# 6. RAG pipeline oluştur
rag = RAGPipeline(embedder, retriever, qa_pipeline)

# 7. Soru sor
question = "Reflü hastalığı belirtileri nelerdir?"
result = rag.answer_question(question)
print(f"Soru: {question}")
print(f"Cevap: {result['answer']}")
