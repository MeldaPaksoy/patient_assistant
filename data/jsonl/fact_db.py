import json
from sentence_transformers import SentenceTransformer
import chromadb

# Embedding modeli
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ChromaDB istemcisi
client = chromadb.Client()
collection = client.create_collection(name="myth_facts")

# JSONL dosyasını oku
with open("data.jsonl", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        item = json.loads(line)

        myth = item["myth"]
        fact = item["fact"]
        section = item.get("section", "Genel")
        source = item.get("source", "Bilinmiyor")

        embedding = model.encode(myth).tolist()

        collection.add(
            documents=[myth],
            embeddings=[embedding],
            ids=[f"myth_{idx}"],
            metadatas=[{
                "fact": fact,
                "section": section,
                "source": source
            }]
        )

print("Efsane-gerçek verisi başarıyla vektör veritabanına kaydedildi.")


query = "Grip aşısı zararlı mı?"
query_emb = model.encode(query).tolist()

results = collection.query(query_embeddings=[query_emb], n_results=1)

print("Efsane:", results["documents"][0][0])
print("Gerçek:", results["metadatas"][0][0]["fact"])
print("Konu:", results["metadatas"][0][0]["section"])
print("Kaynak:", results["metadatas"][0][0]["source"])
