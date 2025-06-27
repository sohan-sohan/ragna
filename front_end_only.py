import streamlit as st
import requests

API_BASE_URL = "http://127.0.0.1:8000"  # Update this if needed

def upload_file(file_obj):
    url = f"{API_BASE_URL}/populate"
    files = {"file": (file_obj.name, file_obj, file_obj.type)}
    response = requests.post(url, files=files)
    return response.json()

def query_document(query):
    url = f"{API_BASE_URL}/query"
    data = {"query": query}
    response = requests.post(url, data=data)
    return response.json()

def main():
    st.set_page_config(page_title="Document Query App", layout="wide")
    st.title("Document Query App")
    st.markdown("### Leverage FastAPI for Document Processing and LLM Querying")
    
    mode = st.sidebar.radio("Select Mode", ["Upload Document", "Query Document"])
    
    if mode == "Upload Document":
        st.markdown("#### Upload a Document")
        uploaded_file = st.file_uploader("Choose your file", type=["pdf", "txt", "docx"])
        if uploaded_file:
            if st.button("Upload and Populate", key="upload_btn"):
                with st.spinner("Uploading and populating Qdrant..."):
                    result = upload_file(uploaded_file)
                    if "message" in result:
                        st.success(result["message"])
                    else:
                        st.error("Error: " + result.get("detail", "Unknown error"))
                    st.json(result)
    else:
        st.markdown("#### Query Document")
        query = st.text_input("Enter your query below", key="query_input")
        if st.button("Submit Query", key="query_btn") and query:
            with st.spinner("Processing query..."):
                result = query_document(query)
                response = result.get("response", "No response")
                context = result.get("context", "No context returned")
                st.markdown("##### LLM Response")
                st.write(response)
                st.markdown("##### Retrieved Context")
                st.text_area("Context", value=context, height=150)

if __name__ == '__main__':
    main()