import { useState } from 'react'
import { getApiUrl } from '../utils/env'

function FileUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
  }

  const uploadFile = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select a file first')
      return
    }

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${getApiUrl()}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMessage(data.message || 'File uploaded successfully!')
      setFile(null)
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-uploader">
      <form onSubmit={uploadFile} role="form">
        <label htmlFor="file-input">File:</label>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="message" data-testid="upload-message">{message}</p>}
    </div>
  )
}

export default FileUploader
