import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import { getApiUrl } from './utils/env'

// Mock the environment utility
jest.mock('./utils/env', () => ({
  getApiUrl: () => 'http://localhost:7860'
}))

// Mock the fetch function
global.fetch = jest.fn()

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    // Reset fetch mock
    global.fetch = jest.fn()
  })

  it('ChatBox is not visible initially', () => {
    render(<App />)
    
    // ChatBox should not be visible
    expect(screen.queryByTestId('question-input')).not.toBeInTheDocument()
  })

  it('ChatBox becomes visible after file upload', async () => {
    // Mock successful file upload
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'File uploaded successfully' })
    })

    render(<App />)
    
    // Upload a file
    const fileInput = screen.getByLabelText('File:')
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    // Wait for the upload to complete and ChatBox to appear
    await waitFor(() => {
      expect(screen.getByTestId('question-input')).toBeInTheDocument()
    })
  })
}) 