from qdrant_client import QdrantClient
from embedding_model.embed_query import query_embedding  # Make sure this exists
from typing import List, Tuple

def search_query(query: str, collection_name: str = "my_documents", top_k: int = 2) -> List[Tuple[str, float]]:
    """
    Takes a query string, embeds it, and searches Qdrant for top_k similar document chunks.

    Returns:
        List of tuples: (matched_text, similarity_score)
    """
    # Step 1: Convert query to embedding
    query_vector = query_embedding(query)

    # Step 2: Connect to Qdrant
    client = QdrantClient(host="localhost", port=6333)

    # Step 3: Perform vector search
    search_result = client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=top_k,
        with_payload=True
    )

    # Step 4: Extract results
    results = []
    for result in search_result:
        text = result.payload.get("text", "")
        score = result.score
        results.append((text, score))

    return results


# Example usage
# if __name__ == "__main__":
#     query = input("Ask your question: ")
#     results = search_query(query)

#     print("\n🔍 Top Matches:")
#     for i, (text, score) in enumerate(results, 1):
#         print(f"\n{i}. Score: {score:.4f}\n{text}")
