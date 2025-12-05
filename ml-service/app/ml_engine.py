import torch
from sentence_transformers import SentenceTransformer
from transformers import pipeline

class MLEngine:
    def __init__(self):
        print("⚡ Loading ML Models... this may take a minute.")
        
        # 1. Embeddings: Lightweight & Fast
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 2. Summarization: T5-Small (Good balance of speed/quality)
        self.summarizer = pipeline("summarization", model="t5-small", device=-1) # device=-1 for CPU
        
        # 3. Zero-Shot Classification (Auto-Tagging)
        # Using a distilled version for speed. BART-Large is too heavy for local CPU MVP.
        self.classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3", device=-1)

        print("✅ Models Loaded Successfully.")

    def generate_embedding(self, text: str):
        # Returns a 384-dimensional vector
        return self.embedder.encode(text).tolist()

    def generate_summary(self, text: str):
        # Constraint to prevent max_length errors on short text
        input_len = len(text.split())
        if input_len < 30:
            return text
            
        max_len = min(150, int(input_len * 0.6))
        min_len = min(30, int(input_len * 0.2))
        
        try:
            summary = self.summarizer(text, max_length=max_len, min_length=min_len, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            print(f"Summarization error: {e}")
            return text[:200] + "..."

    def generate_tags(self, text: str, candidate_labels: list):
        try:
            results = self.classifier(text, candidate_labels, multi_label=True)
            # Return top 2 scores only
            filtered_labels = [label for label, score in zip(results['labels'], results['scores']) if score > 0.4]
            return filtered_labels[:2] 
        except Exception as e:
            print(f"Classification error: {e}")
            return ["Uncategorized"]

# Singleton instance
engine = MLEngine()