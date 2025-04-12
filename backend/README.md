# Backend Development

This is the backend portion of the AIE6-DeployPythonicRAG project, built with FastAPI and Python.

## Prerequisites

- Python 3.8 or higher
- uv package manager

## Setup Instructions

1. **Install uv** (if not already installed)

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Create and activate a virtual environment**

   ```bash
   uv venv
   source .venv/bin/activate  # On Unix/macOS
   # or
   .venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies**

   ```bash
   uv pip install -r requirements.txt
   ```

4. **Start the development server**

   ```bash
   uvicorn main:app --reload
   ```

   This will start the FastAPI development server, typically at http://localhost:7860

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: Available at http://localhost:7860/docs
- **ReDoc**: Available at http://localhost:7860/redoc

These endpoints provide:
- Interactive API testing interface
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Project Structure

- `main.py` - FastAPI application entry point
- `requirements.txt` - Python dependencies
- `app/` - Application modules
  - `api/` - API routes
  - `models/` - Data models
  - `services/` - Business logic

## Environment Variables

Create a `.env` file in the backend directory with the following variables. You can use `.env.example` as a template:

```env
# CORS Settings
# Development: Use "*" to allow all origins
# Production: Specify exact origins, e.g., "https://yourdomain.com,https://api.yourdomain.com"
ALLOWED_ORIGINS=*

# Required API Keys
OPENAI_API_KEY=your-api-key-here
```

The application will automatically load these using python-dotenv. Make sure to:
- Never commit the `.env` file to version control
- Use `.env.example` as a template to create your `.env` file
- In production, always specify exact origins in ALLOWED_ORIGINS instead of using "*"
- Keep your API keys secure and rotate them regularly

Note: The server runs on port 7860 by default when started with `uvicorn main:app --reload`. If you need to change the port or host, you can specify them as command-line arguments:
```bash
uvicorn main:app --reload --port 8000 --host 0.0.0.0
```

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed
2. Check that the virtual environment is activated
3. Verify the server is running on the expected port
4. Check the logs for any error messages

## Development Notes

- The backend uses FastAPI's automatic OpenAPI documentation generation
- API endpoints are versioned and documented using FastAPI's built-in features
- The server includes CORS middleware for frontend integration 