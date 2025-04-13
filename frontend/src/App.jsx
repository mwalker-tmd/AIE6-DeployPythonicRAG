import FileUploader from './components/FileUploader'
import ChatBox from './components/ChatBox'
import { useState } from 'react'

function App() {
  const [fileUploaded, setFileUploaded] = useState(false)

  return (
    <div className="app-container">
      <h1>Pythonic RAG Chat</h1>
      {fileUploaded && <ChatBox />}
      <div className="input-area">
        <FileUploader onUploadSuccess={() => setFileUploaded(true)} />
      </div>
    </div>
  )
}

export default App
