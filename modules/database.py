from __future__ import annotations

import os
from typing import Any, Dict

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

import json
import datetime

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_PATH = "data/scans.json"

_use_mongo = True
try:
    _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    _client.server_info() # trigger connection check
    _db = _client["research_detector"]
    _collection = _db["analyses"]
except Exception:
    _use_mongo = False
    os.makedirs("data", exist_ok=True)
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f:
            json.dump([], f)

def save_analysis(data: Dict[str, Any]):
    if _use_mongo:
        return _collection.insert_one(data)
    else:
        with open(DB_PATH, "r") as f:
            history = json.load(f)
        history.append(data)
        with open(DB_PATH, "w") as f:
            json.dump(history, f)

def get_recent_scans(limit: int = 10) -> list:
    if _use_mongo:
        results = _collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
        return list(results)
    else:
        with open(DB_PATH, "r") as f:
            history = json.load(f)
        # sort by timestamp descending
        history.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return history[:limit]
