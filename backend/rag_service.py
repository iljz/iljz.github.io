from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

from google import genai
from pinecone import Pinecone

class ServiceConfigurationError(RuntimeError):
    """Raised when required environment variables are missing."""


class RetrievalError(RuntimeError):
    """Raised when retrieval or generation fails."""


@dataclass
class Settings:
    pinecone_api_key: str | None
    pinecone_host: str
    pinecone_namespace: str | None
    top_k: int
    gemini_api_key: str | None
    llm_model: str

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            pinecone_api_key=os.getenv("PINECONE_API_KEY"),
            pinecone_host=os.getenv("PINECONE_HOST"),
            pinecone_namespace=os.getenv("PINECONE_NAMESPACE") or None,
            top_k=int(os.getenv("TOP_K", "5")),
            gemini_api_key=os.getenv("GEMINI_API_KEY"),
            llm_model=os.getenv("LLM_MODEL", "gemini-3-flash-preview"),
        )


class RAGService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._pinecone_index = None
        self._gemini_client = None

    @classmethod
    def from_env(cls) -> "RAGService":
        return cls(Settings.from_env())

    def health(self) -> dict[str, Any]:
        missing = self.missing_configuration()
        return {
            "ok": len(missing) == 0,
            "missing_configuration": missing,
            "pinecone_host": self.settings.pinecone_host,
            "top_k": self.settings.top_k,
            "llm_model": self.settings.llm_model,
            "retrieval_mode": "pinecone_integrated_inference",
        }

    def missing_configuration(self) -> list[str]:
        missing = []
        if not self.settings.pinecone_api_key:
            missing.append("PINECONE_API_KEY")
        if not self.settings.pinecone_host:
            missing.append("PINECONE_HOST")
        if not self.settings.gemini_api_key:
            missing.append("GEMINI_API_KEY")
        return missing

    def chat(self, message: str, history: list[dict[str, str]] | None = None) -> dict[str, Any]:
        history = history or []
        missing = self.missing_configuration()
        if missing:
            raise ServiceConfigurationError(
                "Missing backend configuration: " + ", ".join(missing)
            )

        matches = self._retrieve(message)
        context = self._build_context(matches)
        reply = self._generate_response(message=message, history=history, context=context)

        return {
            "reply": reply,
            "sources": self._serialize_sources(matches),
        }

    def _get_index(self):
        if self._pinecone_index is None:
            client = Pinecone(api_key=self.settings.pinecone_api_key)
            self._pinecone_index = client.Index(host=self.settings.pinecone_host)
        return self._pinecone_index

    def _get_gemini_client(self):
        if self._gemini_client is None:
            # The SDK reads GEMINI_API_KEY from the environment by default.
            self._gemini_client = genai.Client()
        return self._gemini_client

    def _retrieve(self, text_query: str) -> list[Any]:
        try:
            response = self._get_index().search(
                namespace=self.settings.pinecone_namespace or "__default__",
                query={
                    "inputs": {"text": text_query},
                    "top_k": self.settings.top_k,
                },
                fields=[
                    "text",
                    "chunk_text",
                    "content",
                    "page_content",
                    "summary",
                    "title",
                    "source",
                    "url",
                    "path",
                ],
            )
        except Exception as exc:  # noqa: BLE001
            raise RetrievalError(f"Pinecone integrated search failed: {exc}") from exc

        result = getattr(response, "result", None)
        if result is not None:
            hits = getattr(result, "hits", None)
            if hits is not None:
                return list(hits or [])

        if isinstance(response, dict):
            result_dict = response.get("result", {})
            if isinstance(result_dict, dict):
                return list(result_dict.get("hits", []) or [])

        return []

    def _hit_fields(self, hit: Any) -> dict[str, Any]:
        fields = getattr(hit, "fields", None)
        if fields is not None:
            return fields or {}
        if isinstance(hit, dict):
            return hit.get("fields", {}) or {}
        return {}

    def _hit_score(self, hit: Any) -> Any:
        score = getattr(hit, "_score", None)
        if score is not None:
            return score
        if isinstance(hit, dict):
            return hit.get("_score")
        return None

    def _build_context(self, matches: list[Any]) -> str:
        if not matches:
            return "No relevant context was retrieved from the vector database."

        chunks = []
        for idx, hit in enumerate(matches, start=1):
            fields = self._hit_fields(hit)

            text = (
                fields.get("text")
                or fields.get("chunk_text")
                or fields.get("content")
                or fields.get("page_content")
                or fields.get("summary")
                or ""
            )
            source = (
                fields.get("title")
                or fields.get("source")
                or fields.get("url")
                or fields.get("path")
                or f"Document {idx}"
            )
            if text:
                chunks.append(f"[{idx}] Source: {source}\n{text}")

        return "\n\n".join(chunks) if chunks else "No textual metadata was returned by Pinecone."

    def _generate_response(
        self,
        *,
        message: str,
        history: list[dict[str, str]],
        context: str,
    ) -> str:
        history_text = "\n".join(
            f"{turn.get('role', 'user').upper()}: {turn.get('content', '')}"
            for turn in history[-8:]
            if turn.get("content")
        )
        prompt = (
            "You are an assistant for Isaac Lo's personal website.\n"
            "Answer questions using the retrieval context when possible. If the user asks a question that is not related to the retrieval context, politely respond that you don't have information on that topic.\n"
            "Be concise, factual, and do not invent unsupported details. Exclude block citations from the response.\n\n"
            f"Retrieved context:\n{context}\n\n"
            f"Conversation history:\n{history_text or 'No prior conversation.'}\n\n"
            f"User question:\n{message}"
        )

        try:
            response = self._get_gemini_client().models.generate_content(
                model=self.settings.llm_model,
                contents=prompt,
            )
        except Exception as exc:  # noqa: BLE001
            raise RetrievalError(f"Gemini generation request failed: {exc}") from exc

        text = getattr(response, "text", None)
        if isinstance(text, str) and text.strip():
            return text.strip()

        if isinstance(response, dict):
            if isinstance(response.get("text"), str) and response["text"].strip():
                return response["text"].strip()

        raise RetrievalError("Gemini response did not contain a usable reply.")

    def _serialize_sources(self, matches: list[Any]) -> list[dict[str, Any]]:
        serialized = []
        for hit in matches:
            fields = self._hit_fields(hit)
            score = self._hit_score(hit)

            serialized.append(
                {
                    "score": score,
                    "title": fields.get("title"),
                    "source": fields.get("source") or fields.get("url") or fields.get("path"),
                    "snippet": (
                        fields.get("text")
                        or fields.get("chunk_text")
                        or fields.get("content")
                        or fields.get("page_content")
                    ),
                }
            )
        return serialized
