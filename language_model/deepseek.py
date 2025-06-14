# llm.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_openrouter_response(prompt,context: str = "", model="deepseek/deepseek-chat:free", temperature=0.85, max_tokens=120): #need to add coontec maybe
    prompt = f"{context}\nQuery: {prompt}"
    api_key = os.getenv("OPENROUTER_API_KEY")
    url = "https://openrouter.ai/api/v1/chat/completions"    #issue: why set this up every api call? can i not take it ouf of this function?
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens # Adjust max_tokens as needed
    }

    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        return data['choices'][0]['message']['content']
    else:
        return f"Error: {response.status_code} - {response.text}"

print(get_openrouter_response("What is the capital of France?"))