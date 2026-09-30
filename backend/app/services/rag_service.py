import os
import json
import pymupdf as fitz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RagService:
    def __init__(self):
        # Store simple DB locally for easy deployment and robustness
        os.makedirs("./knowledge_docs", exist_ok=True)
        self.db_path = "./knowledge_docs/rag_db.json"
        self.load_db()

    def load_db(self):
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    self.db = json.load(f)
            except Exception:
                self.db = {"chunks": [], "metadatas": [], "ids": []}
        else:
            self.db = {"chunks": [], "metadatas": [], "ids": []}

    def save_db(self):
        with open(self.db_path, "w", encoding="utf-8") as f:
            json.dump(self.db, f)

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract all text from a PDF file."""
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text("text") + "\n"
            return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""

    def chunk_text(self, text: str, chunk_size: int = 1500, overlap: int = 300) -> list:
        """Naively split text into chunks with some overlap."""
        chunks = []
        i = 0
        while i < len(text):
            chunks.append(text[i:i+chunk_size])
            i += (chunk_size - overlap)
        return chunks

    def add_document(self, doc_id: str, file_path: str):
        """Parse PDF, chunk it, and add to database."""
        text = self.extract_text_from_pdf(file_path)
        chunks = self.chunk_text(text)
        
        if not chunks:
            return

        ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"doc_id": doc_id} for _ in chunks]
        
        self.db["chunks"].extend(chunks)
        self.db["metadatas"].extend(metadatas)
        self.db["ids"].extend(ids)
        self.save_db()
            
    def delete_document(self, doc_id: str):
        """Remove all chunks for a given document from the DB."""
        try:
            indices_to_keep = [i for i, meta in enumerate(self.db["metadatas"]) if meta.get("doc_id") != doc_id]
            self.db["chunks"] = [self.db["chunks"][i] for i in indices_to_keep]
            self.db["metadatas"] = [self.db["metadatas"][i] for i in indices_to_keep]
            self.db["ids"] = [self.db["ids"][i] for i in indices_to_keep]
            self.save_db()
        except Exception as e:
            print(f"Error deleting doc chunks: {e}")

    def query(self, text: str, n_results: int = 3) -> str:
        """Retrieve most relevant context chunks for a given prompt using TF-IDF."""
        if not self.db["chunks"]:
            return ""
        
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            # Fit on both DB chunks and the query
            all_texts = self.db["chunks"] + [text]
            tfidf_matrix = vectorizer.fit_transform(all_texts)
            
            # Last vector is the query
            query_vector = tfidf_matrix[-1]
            db_vectors = tfidf_matrix[:-1]
            
            # Compute cosine similarities
            similarities = cosine_similarity(query_vector, db_vectors)[0]
            
            # Get top N indices
            n_results = min(n_results, len(self.db["chunks"]))
            top_indices = np.argsort(similarities)[-n_results:][::-1]
            
            # Filter out zero similarity (if prompt is totally unrelated)
            top_chunks = [self.db["chunks"][i] for i in top_indices if similarities[i] > 0]
            
            return "\n\n".join(top_chunks)
        except Exception as e:
            print(f"Query Error: {e}")
            return ""

# Singleton instance
rag_service = RagService()
