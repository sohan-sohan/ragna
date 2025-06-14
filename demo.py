from language_model.deepseek import get_openrouter_response
print(get_openrouter_response("who is naruto", temperature=0.5, max_tokens = 25))