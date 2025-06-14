import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import your functions
from qdrant.populate_db import populate_qdrant
from qdrant.response_of_user_query import search_query
from language_model.deepseek import get_openrouter_response

app = FastAPI()

# Optional CORS middleware if your frontend is hosted on another domain/port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/populate")
async def populate(file: UploadFile = File(...)):
    """
    Endpoint to upload a document and populate Qdrant.
    """
    upload_dir = "uploaded_files"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    try:
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {e}")

    try:
        populate_qdrant(file_path)
        return {"message": "Qdrant populated successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error populating Qdrant: {e}")

@app.post("/query")
async def query(query: str = Form(...)):
    """
    Endpoint to process a query: retrieves similar document chunks and returns an LLM response.
    """
    try:
        similar_docs = search_query(query, collection_name="my_documents", top_k=2)
        context_lines = [f"Text: {text} (score: {score:.3f})" for text, score in similar_docs]
        context = "\n".join(context_lines)
        response = get_openrouter_response(query, context)
        return {"response": response, "context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {e}")