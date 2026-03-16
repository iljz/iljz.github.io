# Backend RAG API (Flask + Pinecone + Gemini)
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY app.py rag_service.py ./

# Default port; override with HOST_PORT at runtime if needed
ENV HOST_PORT=5001
EXPOSE 5001

# Run with gunicorn for production; use 0.0.0.0 so the server is reachable outside the container
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${HOST_PORT} --workers 1 --threads 4 --timeout 120 app:app"]
