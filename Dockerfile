
FROM python:3.11-slim

WORKDIR /app

COPY requirements-big.txt .
COPY requirements-small.txt .

RUN pip install --no-cache-dir -r requirements-big.txt
RUN pip install --no-cache-dir -r requirements-small.txt

COPY ./app .
 CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


