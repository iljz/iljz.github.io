from __future__ import annotations

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from rag_service import RAGService, RetrievalError, ServiceConfigurationError

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/chat": {"origins": "*"}, r"/health": {"origins": "*"}})

    rag_service = RAGService.from_env()

    @app.get("/health")
    def health():
        payload = rag_service.health()
        status_code = 200 if payload["ok"] else 503
        return jsonify(payload), status_code

    @app.post("/chat")
    def chat():
        body = request.get_json(silent=True) or {}
        message = (body.get("message") or "").strip()
        history = body.get("history") or []

        if not message:
            return jsonify({"error": "Request body must include a non-empty 'message'."}), 400

        try:
            payload = rag_service.chat(message=message, history=history)
            return jsonify(payload)
        except ServiceConfigurationError as exc:
            return jsonify({"error": str(exc)}), 503
        except RetrievalError as exc:
            return jsonify({"error": str(exc)}), 502

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("HOST_PORT", "5001")), debug=True)
