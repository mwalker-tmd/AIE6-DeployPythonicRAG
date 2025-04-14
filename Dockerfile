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
    ENV PATH="/root/.local/bin:$PATH"
    ENV PATH="/root/.cargo/bin:$PATH"
    
    # Copy backend files
    COPY backend/pyproject.toml backend/uv.lock ./backend/
    WORKDIR /app/backend

    # Compile and install Python dependencies
    RUN uv pip compile pyproject.toml -o requirements.txt
    RUN uv pip install --system -r requirements.txt
        
    # ------------------------
    # Final stage: Combine Frontend + Backend
    # ------------------------
    FROM python:3.11-slim
    WORKDIR /app
    ENV PYTHONPATH=/app/backend
    
    # Copy backend
    COPY --from=backend-builder /app/backend /app/backend
    
    # Copy frontend build into backend's static folder
    COPY --from=frontend-builder /app/frontend/dist /app/backend/static
    
    # Install uvicorn to serve backend
    RUN pip install uvicorn
    
    # Expose port for Hugging Face
    EXPOSE 7860

    # TEMP: Looking for the Runtimer Error cause.
    RUN echo "🔍 PYTHONPATH is: $PYTHONPATH" \
    && echo "🔍 Listing /app:" && ls -al /app \
    && echo "🔍 Listing /app/backend:" && ls -al /app/backend \
    && echo "🔍 Listing /app/backend/app:" && ls -al /app/backend/app

    # Entrypoint for HF Spaces
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
    