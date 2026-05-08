from __future__ import annotations

import os
import pickle
from typing import List, Tuple

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


FAISS_DIM = 384
MODEL_NAME = "all-MiniLM-L6-v2"

_index = None
_model = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def get_index(index_path: str | None = None):
    global _index
    if _index is not None:
        return _index

    if index_path and os.path.exists(index_path):
        _index = faiss.read_index(index_path)
        return _index

    _index = faiss.IndexFlatL2(FAISS_DIM)
    return _index


def add_document(text: str, index_path: str | None = None):
    model = get_model()
    index = get_index(index_path)

    emb = model.encode([text])
    vec = np.array(emb).astype("float32")
    index.add(vec)

    if index_path:
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
        faiss.write_index(index, index_path)


def search_similar(text: str, k: int = 5, index_path: str | None = None) -> Tuple[np.ndarray, np.ndarray]:
    model = get_model()
    index = get_index(index_path)

    emb = model.encode([text])
    vec = np.array(emb).astype("float32")
    distances, indices = index.search(vec, k)
    return distances, indices

