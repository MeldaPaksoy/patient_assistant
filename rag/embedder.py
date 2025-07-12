from sentence_transformers import SentenceTransformer
import numpy as np

class Embedder:
    def __init__(self, model_name="paraphrase-multilingual-MiniLM-L12-v2"):
        self.model = SentenceTransformer(model_name)

    def embed(self, texts):
        """
        texts: list of strings
        returns: numpy array of embeddings
        """
        return self.model.encode(texts, convert_to_numpy=True)

