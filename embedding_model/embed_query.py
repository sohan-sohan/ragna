from sentence_transformers import SentenceTransformer
import numpy as np
from pathlib import Path
from typing import Tuple, List


# Load model globally
model = SentenceTransformer('all-MiniLM-L6-v2')


def query_embedding(query: str) -> np.ndarray:
    """
    Converts a user query into a dense vector.
    """
    return model.encode(query)


def document_embedding(file_path: str) -> Tuple[np.ndarray, List[str]]:
    """
    Extracts text from a file, splits into chunks, and returns embeddings.
    
    Returns:
        Tuple[np.ndarray, List[str]]: Embedding vectors and their corresponding text chunks.
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = path.suffix.lower()

    # Read file content
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    elif ext == ".pdf":
        import PyPDF2
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = "\n".join(
                page.extract_text() or "" for page in reader.pages
            )

    elif ext == ".docx":
        import docx
        doc = docx.Document(file_path)
        text = "\n".join(para.text for para in doc.paragraphs)

    else:
        raise ValueError(f"Unsupported file type: {ext}")

    # Split into chunks
    def split_text(text: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
        words = text.split()
        chunks = []
        i = 0
        while i < len(words):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
            i += chunk_size - overlap
        return chunks

    chunks = split_text(text)
    embeddings = model.encode(chunks)

    return (embeddings, chunks)

# print(query_embedding("who is naruto"))

# print(document_embedding("kushal.docx")[0]) 