# ------------------------
# STAGE 1: Build Frontend
# ------------------------
    FROM node:20 AS frontend-builder
    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend/ ./
    RUN npm run build
    
    # ------------------------
    # STAGE 2: Build Backend
    # ------------------------
    FROM python:3.11-slim AS backend-builder
    WORKDIR /app
    
    # Install system deps
    RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
    
    # Install uv (you can change to pip if preferred)
    RUN curl -Ls https://astral.sh/uv/install.sh | bash
    ENV PATH="/root/.cargo/bin:$PATH"
    
    # Copy backend and install Python deps
    COPY backend/pyproject.toml backend/uv.lock ./backend/
    WORKDIR /app/backend
    RUN uv pip install --system -r <(uv pip compile pyproject.toml)
    
    # ------------------------
    # Final stage: Combine Frontend + Backend
    # ------------------------
    FROM python:3.11-slim
    WORKDIR /app
    
    # Copy backend
    COPY --from=backend-builder /app/backend /app/backend
    
    # Copy frontend build into backend's static folder
    COPY --from=frontend-builder /app/frontend/dist /app/backend/static
    
    # Install uvicorn to serve backend
    RUN pip install uvicorn
    
    # Expose port for Hugging Face
    EXPOSE 7860
    
    # Entrypoint for HF Spaces
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
    