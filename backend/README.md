# Backend RAG Server

This folder contains a Flask backend for the website chat agent.

## Endpoints

- `GET /health`
- `POST /chat`

Example request:

```json
{
  "message": "What projects has Isaac worked on?",
  "history": [
    { "role": "user", "content": "Tell me about Isaac." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Example response:

```json
{
  "reply": "Isaac has worked on ...",
  "sources": [
    {
      "score": 0.91,
      "title": "Resume chunk",
      "source": "resume.pdf",
      "snippet": "..."
    }
  ]
}
```

## Environment

Copy `.env.example` to `.env`.

Notes:

- `PINECONE_HOST` is already set to the Pinecone host for this project.
- `PINECONE_API_KEY` should come from your local environment or `.env`.
- `GEMINI_API_KEY` is used by the Google GenAI SDK.
- Retrieval uses Pinecone integrated inference, so the backend sends text directly to Pinecone search.
- Gemini is used for answer generation.
- Default model:
  - `LLM_MODEL=gemini-3-flash-preview`

## Install

If `pip` is not on your shell path, use `python -m pip` or `python3 -m pip`.

```bash
python3 -m pip install -r requirements.txt
```

## Run

```bash
python3 app.py
```

The server defaults to `http://127.0.0.1:5000`.
