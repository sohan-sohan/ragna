

from fastapi import FastAPI

app = FastAPI()


@app.get('/')
def home():
    return 'update'


@app.get('/about')
def about():
    return 'about'
