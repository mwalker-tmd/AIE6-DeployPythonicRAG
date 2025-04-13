export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:7860';
}; 