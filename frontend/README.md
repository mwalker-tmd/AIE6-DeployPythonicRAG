# Frontend Development

This is the frontend portion of the AIE6-DeployPythonicRAG project, built with React and Vite.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

   This will start the Vite development server, typically at http://localhost:5173

3. **Build for production**

   ```bash
   npm run build
   ```

   This will create a production-ready build in the `dist` directory.

## Testing

The project uses Jest and React Testing Library for testing.

1. **Run tests**

   ```bash
   npm test
   ```

2. **Run tests in watch mode**

   ```bash
   npm run test:watch
   ```

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `assets/` - Static assets (images, etc.)
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## Backend Integration

The frontend communicates with the backend API using the `VITE_API_URL` environment variable (typically set to http://localhost:7860 in development). Make sure the backend server is running when developing the frontend.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables. You can use `.env.example` as a template:

```env
# API Configuration
# Development: Typically http://localhost:7860
# Production: Your production API URL
VITE_API_URL=http://localhost:7860
```

Make sure to:
- Never commit the `.env` file to version control
- Use `.env.example` as a template to create your `.env` file
- Update the API URL for different environments (development, staging, production)

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed
2. Check that the backend server is running
3. Clear your browser cache
4. Try deleting the `node_modules` folder and running `npm install` again

## Development Notes

- The frontend uses Vite for fast development and optimized production builds
- React components are organized in the `src/components` directory
- Environment variables are loaded at build time using Vite's `import.meta.env` syntax
- The application uses a streaming response from the backend for real-time chat updates
- CORS is configured to allow communication with the backend API
- The UI is designed to be responsive and mobile-friendly
