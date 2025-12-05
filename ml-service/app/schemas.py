from pydantic import BaseModel
from typing import List, Optional

class ProcessRequest(BaseModel):
    text: str
    candidate_labels: Optional[List[str]] = ["Research", "Engineering", "Design", "Business", "Personal"]

class ProcessResponse(BaseModel):
    summary: str
    embedding: List[float]
    tags: List[str]
    sentiment: str  # Added bonus: simple sentiment analysis logic if needed