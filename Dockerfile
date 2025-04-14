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
# STAGE 2: Build Backend & Compile Deps
# ------------------------
FROM python:3.11-slim AS backend-builder
WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install uv (unpacked pip-compatible resolver)
RUN curl -Ls https://astral.sh/uv/install.sh | bash
ENV PATH="/root/.local/bin:$PATH"

# Copy full backend source code
COPY backend/ ./backend/
WORKDIR /app/backend

# Compile dependencies
RUN uv pip compile pyproject.toml -o requirements.txt

# ------------------------
# Final stage: Combine Frontend + Backend
# ------------------------
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONPATH=/app/backend

# Copy backend app code and compiled requirements
COPY --from=backend-builder /app/backend /app/backend

# Install Python dependencies in runtime container
COPY --from=backend-builder /app/backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy frontend build into static folder
COPY --from=frontend-builder /app/frontend/dist /app/backend/static

# Expose port for HF Spaces
EXPOSE 7860

# Start the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
