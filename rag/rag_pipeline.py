class RAGPipeline:
    def __init__(self, embedder, retriever, qa_pipeline):
        self.embedder = embedder
        self.retriever = retriever
        self.qa_pipeline = qa_pipeline

    def answer_question(self, question, top_k=3):
        # Soruyu embedle
        question_embedding = self.embedder.embed([question])

        # En alakalı pasajları al
        contexts = self.retriever.search(question_embedding, top_k=top_k)

        # Contextleri birleştir
        combined_context = " ".join(contexts)

        # QA pipeline ile cevabı çıkar
        result = self.qa_pipeline(question=question, context=combined_context)
        return result

