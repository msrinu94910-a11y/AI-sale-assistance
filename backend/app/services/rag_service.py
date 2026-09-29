import os
import fitz  # PyMuPDF
import chromadb
from chromadb.utils import embedding_functions

# Initialize a simple, robust persistent vector store
# DefaultEmbeddingFunction automatically uses all-MiniLM-L6-v2 under the hood
default_ef = embedding_functions.DefaultEmbeddingFunction()

class RagService:
    def __init__(self):
        # Store vector DB locally for simple deployment
        os.makedirs("./chroma_data", exist_ok=True)
        self.client = chromadb.PersistentClient(path="./chroma_data")
        self.collection = self.client.get_or_create_collection(
            name="knowledge_base", 
            embedding_function=default_ef
        )

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract all text from a PDF file."""
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        return text

    def chunk_text(self, text: str, chunk_size: int = 1500, overlap: int = 300) -> list:
        """Naively split text into chunks with some overlap."""
        chunks = []
        i = 0
        while i < len(text):
            chunks.append(text[i:i+chunk_size])
            i += (chunk_size - overlap)
        return chunks

    def add_document(self, doc_id: str, file_path: str):
        """Parse PDF, chunk it, and add to vector database."""
        text = self.extract_text_from_pdf(file_path)
        chunks = self.chunk_text(text)
        
        if not chunks:
            return

        ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"doc_id": doc_id} for _ in chunks]
        
        self.collection.add(
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )
            
    def delete_document(self, doc_id: str):
        """Remove all chunks for a given document from the vector DB."""
        try:
            self.collection.delete(where={"doc_id": doc_id})
        except Exception as e:
            print(f"Error deleting doc chunks: {e}")

    def query(self, text: str, n_results: int = 3) -> str:
        """Retrieve most relevant context chunks for a given prompt."""
        if self.collection.count() == 0:
            return ""
        
        try:
            results = self.collection.query(
                query_texts=[text],
                n_results=min(n_results, self.collection.count())
            )
            
            if results and 'documents' in results and results['documents']:
                if results['documents'][0]:
                    return "\n\n".join(results['documents'][0])
            return ""
        except Exception as e:
            print(f"ChromaDB Query Error: {e}")
            return ""

# Singleton instance
rag_service = RagService()
