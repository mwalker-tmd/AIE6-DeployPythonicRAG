import FileUploader from './components/FileUploader'
import { useState } from 'react'

function App() {
  const [fileUploaded, setFileUploaded] = useState(false)

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Pythonic RAG Chat</h1>
      <FileUploader onUpload={() => setFileUploaded(true)} />
      {fileUploaded}
    </div>
  )
}

export default App
