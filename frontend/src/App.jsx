import FileUploader from './components/FileUploader'
import ChatBox from './components/ChatBox'
import { useState } from 'react'

function App() {
  const [fileUploaded, setFileUploaded] = useState(false)

  return (
    <div className="app-container">
      <div style={{ textAlign: 'center' }}>
        <img src="/logo_light_transparent.png" alt="TAMARK Designs" style={{ maxWidth: '250px' }} />
      </div>
      <h1 style={{ textAlign: 'center' }}>Pythonic RAG Chat</h1>
      {fileUploaded && <ChatBox />}
      <div className="input-area">
        <FileUploader onUploadSuccess={() => setFileUploaded(true)} />
      </div>
    </div>
  )
}

export default App
