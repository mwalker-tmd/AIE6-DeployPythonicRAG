import { useState } from 'react'
import { getApiUrl } from '../utils/env'

export default function ChatBox() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const askQuestion = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsStreaming(true)
    setResponse('')

    try {
      const formData = new FormData()
      formData.append('question', question)

      const response = await fetch(`${getApiUrl()}/query`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // For testing purposes, let's handle both streaming and non-streaming responses
      if (response.body) {
        // Handle streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const text = decoder.decode(value)
          setResponse(prev => prev + text)
        }
      } else {
        // Handle regular JSON response
        const data = await response.json()
        setResponse(data.response || 'No response received')
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: ' + error.message)
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <>
      <div className="response-panel" data-testid="response-panel">{response || 'Response will appear here...'}</div>
      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        data-testid="question-input"
      />
      <button onClick={askQuestion} disabled={isStreaming}>
        {isStreaming ? 'Thinking...' : 'Ask'}
      </button>
    </>
  )
}