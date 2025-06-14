import streamlit as st
import tempfile
import os

# Import your function to populate Qdrant (which uses your embedding mechanism internally)
from qdrant.populate_db import populate_qdrant
# Import your Qdrant search function that returns similar chunks
from qdrant.response_of_user_query import search_query
# Import your LLM function; now expecting query and context
from language_model.deepseek import get_openrouter_response

def main():
    st.title("Document Query App")
    
    # Choose between populating the database and querying the LLM.
    mode = st.sidebar.radio("Select Mode", ["Upload & Populate", "Query Document"])
    
    if mode == "Upload & Populate":
        st.header("Upload a Document to Populate Qdrant")
        uploaded_file = st.file_uploader("Select a document", type=["pdf", "txt", "docx"])
        
        if uploaded_file is not None:
            # Write the uploaded file to a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[1]) as tmp_file:
                tmp_file.write(uploaded_file.getbuffer())
                tmp_file_path = tmp_file.name
            
            st.success("File uploaded successfully!")
            st.info("Populating Qdrant (computing embeddings, etc.)...")

            try:
                populate_qdrant(tmp_file_path)
                st.success("Qdrant populated successfully!")
            except Exception as e:
                st.error(f"Failed to populate Qdrant: {e}")
            finally:
                os.remove(tmp_file_path)

    else:
        st.header("Query Document")
        query = st.text_input("Enter your query:")
        
        if st.button("Submit Query") and query:
            st.info("Retrieving similar document chunks...")
            try:
                # Use your search_query function to retrieve similar document chunks
                similar_docs = search_query(query, collection_name="my_documents", top_k=2)
                # Combine retrieved texts into a context string
                context_lines = [f"Text: {text} (score: {score:.3f})" for text, score in similar_docs]
                context = "\n".join(context_lines)
                
                st.write("Retrieved Document Chunks:")
                st.text_area("Context", context, height=150)
                
                st.info("Getting response from LLM...")
                # Get output from your LLM using both query and context
                response = get_openrouter_response(query, context)
                st.subheader("Response")
                st.write(response)
            except Exception as e:
                st.error(f"Failed to process query: {e}")

if __name__ == '__main__':
    main()