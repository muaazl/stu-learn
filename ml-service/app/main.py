from fastapi import FastAPI, HTTPException
from app.schemas import ProcessRequest, ProcessResponse
from app.ml_engine import engine
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI(title="StuLearn ML Microservice")

@app.get("/")
def health_check():
    return {"status": "running", "models": "loaded"}

@app.post("/process", response_model=ProcessResponse)
def process_text(payload: ProcessRequest):
    """
    Analyzes text to return:
    1. Summary
    2. Vector Embedding
    3. Auto-generated Tags
    """
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        # Run ML tasks
        summary = engine.generate_summary(payload.text)
        embedding = engine.generate_embedding(payload.text)
        tags = engine.generate_tags(payload.text, payload.candidate_labels)
        
        return ProcessResponse(
            summary=summary,
            embedding=embedding,
            tags=tags,
            sentiment="neutral"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ClusterRequest(BaseModel):
    embeddings: List[List[float]]

@app.post("/cluster")
def cluster_embeddings(payload: ClusterRequest):
    """
    Reduces 384-dim vectors to 2D (x, y) for visualization
    and assigns a cluster ID.
    """
    matrix = np.array(payload.embeddings)
    
    if len(matrix) < 3:
        return {"points": [{"x": 0, "y": 0, "cluster": 0} for _ in payload.embeddings]}

    pca = PCA(n_components=2)
    reduced = pca.fit_transform(matrix)

    n_clusters = max(2, int(len(matrix) ** 0.5))
    kmeans = KMeans(n_clusters=n_clusters, n_init=10)
    labels = kmeans.fit_predict(matrix)

    results = []
    for i, (x, y) in enumerate(reduced):
        results.append({
            "x": float(x), 
            "y": float(y), 
            "cluster": int(labels[i])
        })
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)