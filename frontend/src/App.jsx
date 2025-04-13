import FileUploader from './components/FileUploader'
import ChatBox from './components/ChatBox'
import { useState } from 'react'
import './App.css' // We'll centralize layout styling

function App() {
  const [fileUploaded, setFileUploaded] = useState(false)

  return (
    <div className={`app-root ${fileUploaded ? 'chat-mode' : 'initial-mode'}`}>
      <div className="branding">
        <img
          src="/logo_light_transparent.png"
          alt="TAMARK Designs"
          className="logo"
        />
        <h1>Pythonic RAG Chat</h1>
      </div>

      {fileUploaded && (
        <div className="chat-section">
          <ChatBox />
        </div>
      )}

      <div className="footer-uploader">
        <FileUploader onUploadSuccess={() => setFileUploaded(true)} />
      </div>
    </div>
  )
}

export default App
