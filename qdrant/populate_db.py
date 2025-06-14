from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from embedding_model.embed_query import document_embedding
from pathlib import Path
import uuid

def populate_qdrant(file_path: str, collection_name: str = "my_documents"):
    # Load document embeddings and chunks
    embeddings, chunks = document_embedding(file_path)

    # Initialize Qdrant client (adjust if using Docker or remote)
    client = QdrantClient(host="localhost", port=6333)

    # Recreate the collection (clears previous data)
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=embeddings.shape[1],  # 384 for MiniLM
            distance=Distance.COSINE
        )
    )

    # Prepare points to insert
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embeddings[i],
            payload={"text": chunks[i]}
        )
        for i in range(len(chunks))
    ]

    # Upload to Qdrant
    client.upsert(collection_name=collection_name, points=points)

    print(f"✅ Populated collection '{collection_name}' with {len(points)} chunks from {Path(file_path).name}.")


# Example usage
# if __name__ == "__main__":
#     populate_qdrant(r"samples//sample1.pdf")  # Change this to your file
