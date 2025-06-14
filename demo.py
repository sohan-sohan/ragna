from language_model.deepseek import get_openrouter_response
# print(get_openrouter_response("who is naruto", temperature=0.5, max_tokens = 25))
from qdrant.populate_db import populate_qdrant
from qdrant.response_of_user_query import search_query
from embedding_model.embed_query import query_embedding, document_embedding
# print(query_embedding("who is naruto"))

# print(document_embedding(r"C:\Users\ARSHAN\Desktop\sohan2\ragna\samples\sample1.pdf"))

# populate_qdrant(r"samples//sample1.pdf") #everytime u run, previous embeddings are overwritten with this new document

query = input("Ask your question: ")
results = search_query(query, top_k = 1)

print("\n🔍 Top Matches:")
for i, (text, score) in enumerate(results, 1):
    print(f"\n{i}. Score: {score:.4f}\n{text}")
