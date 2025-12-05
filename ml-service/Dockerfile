# Use Python 3.9
FROM python:3.9

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies (cache mount speeds up build)
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy app code
COPY . .

# Create a user to run the app (HuggingFace requirement)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

# Expose port 7860 (HuggingFace default)
EXPOSE 7860

# Run FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]