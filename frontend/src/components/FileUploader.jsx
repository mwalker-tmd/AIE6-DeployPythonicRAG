import { useState } from 'react'

export default function FileUploader({ onUpload }) {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  const uploadFile = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    setStatus('Uploading...')

    try {
      const res = await fetch('http://localhost:7860/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setStatus(data.message)
      onUpload()
    } catch (err) {
      console.error(err)
      setStatus('Upload failed.')
    }
  }

  return (
    <div>
      <label htmlFor="file-upload">File:</label>
      <input id="file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
      <p>{status}</p>
    </div>
  )
}
