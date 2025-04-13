import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatBox from './ChatBox'

jest.mock('../utils/env', () => ({
  getApiUrl: () => 'http://localhost:7860',
}))

global.fetch = jest.fn()

describe('ChatBox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('renders the chat interface', () => {
    render(<ChatBox />)
    expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask' })).toBeInTheDocument()
    expect(screen.getByTestId('response-panel')).toHaveTextContent('Response will appear here...')
  })

  it('updates question state when typing', () => {
    render(<ChatBox />)
    const textarea = screen.getByPlaceholderText('Ask a question...')
    fireEvent.change(textarea, { target: { value: 'Test question' } })
    expect(textarea.value).toBe('Test question')
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
  
    render(<ChatBox />)
  
    fireEvent.change(screen.getByPlaceholderText('Ask a question...'), {
      target: { value: 'Test question' },
    })
  
    const submitButton = screen.getByRole('button', { name: 'Ask' })
    fireEvent.click(submitButton)
  
    await waitFor(() => {
      expect(screen.getByTestId('response-panel')).toHaveTextContent('Error: Network error')
    })
  
    expect(submitButton).not.toBeDisabled()
    expect(submitButton).toHaveTextContent('Ask')
  
    consoleSpy.mockRestore()
  })
  
  it('handles streaming responses correctly', async () => {
    const streamChunks = ['Hello', ' ', 'world', '!']
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(streamChunks[0]) })
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(streamChunks[1]) })
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(streamChunks[2]) })
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(streamChunks[3]) })
        .mockResolvedValueOnce({ done: true }),
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    })

    render(<ChatBox />)

    fireEvent.change(screen.getByPlaceholderText('Ask a question...'), {
      target: { value: 'Streaming test' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))

    await waitFor(() => {
      expect(screen.getByTestId('response-panel')).toHaveTextContent('Hello world!')
    })
  })

  it('handles non-streaming JSON responses correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      body: null,
      json: async () => ({ response: 'Static answer' }),
    })

    render(<ChatBox />)
    fireEvent.change(screen.getByPlaceholderText('Ask a question...'), {
      target: { value: 'Static test' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))

    await waitFor(() => {
      expect(screen.getByTestId('response-panel')).toHaveTextContent('Static answer')
    })
  })

  it('disables button and shows thinking text during request', async () => {
    // Prepare a controllable promise
    let readCalled = false
  
    const mockReader = {
      read: jest.fn(() => {
        if (!readCalled) {
          readCalled = true
          // Return an unresolved promise initially to simulate delay
          return new Promise(resolve => setTimeout(() => resolve({ done: true }), 50))
        }
        return Promise.resolve({ done: true })
      }),
    }
  
    global.fetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => mockReader },
    })
  
    render(<ChatBox />)
    fireEvent.change(screen.getByPlaceholderText('Ask a question...'), {
      target: { value: 'In progress test' },
    })
  
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }))
  
    // Immediately check that it's in the "thinking" state
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveTextContent('Thinking...')
  
    // Wait for it to finish
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Ask')
      expect(screen.getByRole('button')).not.toBeDisabled()
    })
  })
})
