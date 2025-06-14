

from fastapi import FastAPI

app = FastAPI()


from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient(host="qdrant", port=6333)  # "qdrant" is the service name in Docker

client.recreate_collection(
    collection_name="my_collection",
    vectors_config=VectorParams(size=3, distance=Distance.COSINE),
)

client.upsert(
    collection_name="my_collection",
    points=[
        {
            "id": 1,
            "vector": [0.1, 0.2, 0.3],  # your embedding here
            "payload": {"text": "hello world"},
        },
    ]
)

results = client.search(
    collection_name="my_collection",
    query_vector=[0.1, 0.2, 0.3],
    top=3,
)


@app.get('/')
def home():
    return results

@app.get('/about')
def about():
    return 'about'


