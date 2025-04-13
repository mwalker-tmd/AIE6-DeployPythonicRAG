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
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('ChatBox is not visible initially', () => {
    render(<App />)
    expect(screen.getByText('Pythonic RAG Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('File:')).toBeInTheDocument()
    expect(screen.queryByTestId('question-input')).not.toBeInTheDocument()
  })

  it('ChatBox becomes visible after file upload', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'File uploaded successfully' })
    })

    render(<App />)
    const fileInput = screen.getByLabelText('File:')
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('File uploaded successfully')
      expect(screen.getByTestId('question-input')).toBeInTheDocument()
    })
  })

  it('does not show ChatBox if upload fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    render(<App />)
    const fileInput = screen.getByLabelText('File:')
    const file = new File(['fail content'], 'fail.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.queryByTestId('question-input')).not.toBeInTheDocument()
      expect(screen.getByTestId('upload-message')).toHaveTextContent('Error: HTTP error! status: 500')
    })
  })

  it('shows ChatBox again if a second file is uploaded after failure', async () => {
    // First upload fails
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    render(<App />)
    const fileInput = screen.getByLabelText('File:')
    const file1 = new File(['fail'], 'fail.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file1] } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.queryByTestId('question-input')).not.toBeInTheDocument()
    })

    // Second upload succeeds
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Second upload success' })
    })

    const file2 = new File(['pass'], 'success.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file2] } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('Second upload success')
      expect(screen.getByTestId('question-input')).toBeInTheDocument()
    })
  })
})
