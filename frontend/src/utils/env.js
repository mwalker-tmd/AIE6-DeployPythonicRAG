export const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:7860'
  console.log("📦 VITE_API_URL (in env.js):", url)
  return url
}
