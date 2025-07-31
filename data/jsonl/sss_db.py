import json
from sentence_transformers import SentenceTransformer
import chromadb

# Modeli yükle
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ChromaDB başlat
client = chromadb.Client()
collection = client.create_collection(name="sss_collection")

# Dosyayı oku ve vektör veritabanına ekle
with open("question.jsonl", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        item = json.loads(line)

        question = item["prompt"]
        answer = item["completion"]
        category = item.get("category", "Genel")

        embedding = model.encode(question).tolist()

        collection.add(
            documents=[question],
            embeddings=[embedding],
            ids=[f"faq_{idx}"],
            metadatas={"answer": answer, "category": category}
        )

print(" Tüm sorular başarıyla eklendi.")


query = "Şeker hastalığı nasıl anlaşılır?"
query_emb = model.encode(query).tolist()

results = collection.query(query_embeddings=[query_emb], n_results=1)

print(" En benzer soru:", results["documents"][0][0])
print(" Yanıt:", results["metadatas"][0][0]["answer"])

