# StuLearn 🧠

**StuLearn** is an AI-powered research workspace designed to help users organize, analyze, and visualize knowledge. It ingests research papers and notes, using local Machine Learning models to generate embeddings, summaries, and topic clusters automatically.

Unlike wrappers around paid APIs (like OpenAI), StuLearn runs its intelligence layer entirely on **open-source models** (MiniLM, T5, BART), ensuring privacy and zero cost.

<img width="1654" height="1966" alt="stu-learn-ui" src="https://github.com/user-attachments/assets/00492331-3ef7-4185-bd81-97951938f7b2" />

## ✨ Key Features

- **📄 Document Ingestion**: Upload PDFs or text files; the system parses and cleans the content automatically.
- **🤖 Local AI Pipeline**:
  - **Summarization**: Distills long papers into concise abstracts (T5-Small).
  - **Auto-Tagging**: Classifies content into categories like Tech, Finance, or Health (Zero-Shot Classification).
  - **Embeddings**: Vectorizes text for machine understanding (All-MiniLM-L6-v2).
- **🔍 Semantic Search**: Search by *meaning*, not just keywords. Querying "How to save money" retrieves documents about "Budgeting."
- **🕸️ Knowledge Graph**: Visualizes topic clusters using PCA & K-Means to show how your notes relate to each other.
- **⚡ Modern UI**: Built with Next.js 14, TypeScript, TailwindCSS, and Shadcn/UI.

## 🏗️ Architecture

StuLearn operates as a Monorepo with three distinct services:

1.  **Frontend (`/client`)**: Next.js (App Router) + Zustand + Recharts.
2.  **Backend (`/server`)**: Node.js + Express + MongoDB (Data Layer & Orchestration).
3.  **ML Microservice (`/ml-service`)**: Python + FastAPI + HuggingFace Transformers (The "Brain").

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, Shadcn/UI, Framer Motion |
| **State** | Zustand |
| **Backend** | Node.js, Express, Multer |
| **Database** | MongoDB Atlas (Vector + Metadata store) |
| **ML Engine** | Python, FastAPI, PyTorch, Scikit-Learn |
| **Models** | `all-MiniLM-L6-v2` (Vectors), `t5-small` (Summary), `bart-large-mnli` (Tags) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Connection String

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/stu-learn.git
cd stu-learn
```

### 2. Setup ML Service (The Brain)
```bash
cd ml-service
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn app.main:app --reload --port 8000
```
*Note: First run will download ~1GB of models from HuggingFace.*

### 3. Setup Backend
Open a new terminal:
```bash
cd server
npm install
```
Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ML_SERVICE_URL=http://localhost:8000
```
Run the server:
```bash
npm run dev
```

### 4. Setup Frontend
Open a new terminal:
```bash
cd client
npm install
```
Create a `.env.local` file in `/client`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Run the client:
```bash
npm run dev
```

Visit `http://localhost:3000` to start researching.
