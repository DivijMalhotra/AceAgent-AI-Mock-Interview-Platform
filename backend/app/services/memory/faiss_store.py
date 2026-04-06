"""
ACIE Backend — FAISS Vector Database Memory.
Stores and searches semantic embeddings for long-term / contextual memory.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import faiss
import numpy as np

from app.core.config import settings
from app.core.logging import logger
from app.services.memory.embeddings import embeddings_pipeline

class FAISSStore:
    """Manages the semantic memory cache using FAISS and local disk storage."""
    
    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self.index_path = settings.faiss_index_path / "index.faiss"
        self.meta_path = settings.faiss_index_path / "meta.json"
        
        self.index = None
        self.metadata: dict[int, dict[str, Any]] = {}

        self._load_index()

    def _load_index(self):
        if self.index_path.exists():
            try:
                self.index = faiss.read_index(str(self.index_path))
                if self.meta_path.exists():
                    with open(self.meta_path, "r", encoding="utf-8") as f:
                        self.metadata = {int(k): v for k, v in json.load(f).items()}
                logger.info("Loaded FAISS index with %d vectors", self.index.ntotal)
            except Exception as e:
                logger.error("Failed to load FAISS index: %s", e)
                
        if self.index is None:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = {}
            logger.info("Initialized new FAISS flat index")

    def _save_index(self):
        faiss.write_index(self.index, str(self.index_path))
        with open(self.meta_path, "w", encoding="utf-8") as f:
            json.dump(self.metadata, f)

    async def add_memory(self, session_id: str, text: str, role: str) -> None:
        """Embeds text and adds it to the FAISS index with metadata."""
        vector = await embeddings_pipeline.get_embedding(text)
        if not vector:
            return

        vector_np = np.array([vector], dtype=np.float32)
        idx = self.index.ntotal

        self.index.add(vector_np)
        self.metadata[idx] = {
            "session_id": session_id,
            "text": text,
            "role": role,
            "idx": idx
        }
        self._save_index()

    async def search_memory(self, query: str, session_id: str, top_k: int = 3) -> list[dict[str, Any]]:
        """Searches the FAISS index for relevant past conversation context."""
        if self.index.ntotal == 0:
            return []

        vector = await embeddings_pipeline.get_embedding(query)
        if not vector:
            return []

        vector_np = np.array([vector], dtype=np.float32)
        distances, indices = self.index.search(vector_np, k=top_k * 3) # Over-fetch and filter
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1: # FAISS padding empty spots
                continue
                
            meta = self.metadata.get(int(idx))
            if meta and meta.get("session_id") == session_id:
                res = meta.copy()
                res["distance"] = float(dist)
                results.append(res)
                
                if len(results) == top_k:
                    break
                    
        return results

faiss_store = FAISSStore()
