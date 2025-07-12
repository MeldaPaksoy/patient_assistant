import faiss
import numpy as np

class Retriever:
    def __init__(self, embedding_dim):
        # L2 mesafesine göre indeks oluştur
        self.index = faiss.IndexFlatL2(embedding_dim)
        self.corpus = []  # metinleri burada tutacağız

    def add_corpus(self, embeddings, corpus_texts):
        """
        embeddings: numpy array (n_samples, embedding_dim)
        corpus_texts: list of metinler (n_samples)
        """
        self.index.add(embeddings)
        self.corpus.extend(corpus_texts)

    def search(self, query_embedding, top_k=5):
        """
        query_embedding: numpy array (1, embedding_dim)
        returns: top_k benzer metin listesi
        """
        distances, indices = self.index.search(query_embedding, top_k)
        results = []
        for idx in indices[0]:
            if idx < len(self.corpus):
                results.append(self.corpus[idx])
        return results

