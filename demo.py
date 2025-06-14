from language_model.deepseek import get_openrouter_response
# print(get_openrouter_response("who is naruto", temperature=0.5, max_tokens = 25))

from embedding_model.embed_query import query_embedding, document_embedding
# print(query_embedding("who is naruto"))

print(document_embedding(r"C:\Users\ARSHAN\Desktop\sohan2\ragna\samples\sample.pdf")[0])