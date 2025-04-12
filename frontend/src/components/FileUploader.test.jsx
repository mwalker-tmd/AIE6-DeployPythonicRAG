import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploader from './FileUploader';

// Mock the fetch function
global.fetch = jest.fn();

describe('FileUploader Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    fetch.mockReset();
  });

  test('renders file input and upload button', () => {
    render(<FileUploader onUpload={() => {}} />);
    
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/file/i)).toBeInTheDocument();
  });

  test('shows uploading status when file is being uploaded', async () => {
    // Mock a successful fetch response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve({ message: 'File uploaded successfully' })
      })
    );

    render(<FileUploader onUpload={() => {}} />);
    
    // Create a file object
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file selection
    const fileInput = screen.getByLabelText(/file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Click the upload button
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));
    
    // Check if uploading status is displayed
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    
    // Wait for the upload to complete
    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully')).toBeInTheDocument();
    });
    
    // Verify fetch was called with the correct parameters
    expect(fetch).toHaveBeenCalledWith('http://localhost:7860/upload', {
      method: 'POST',
      body: expect.any(FormData)
    });
  });

  test('handles upload failure', async () => {
    // Mock a failed fetch response
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    render(<FileUploader onUpload={() => {}} />);
    
    // Create a file object
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file selection
    const fileInput = screen.getByLabelText(/file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Click the upload button
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Upload failed.')).toBeInTheDocument();
    });
  });

  test('calls onUpload callback after successful upload', async () => {
    // Mock a successful fetch response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve({ message: 'File uploaded successfully' })
      })
    );

    // Create a mock callback function
    const mockOnUpload = jest.fn();
    
    render(<FileUploader onUpload={mockOnUpload} />);
    
    // Create a file object
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file selection
    const fileInput = screen.getByLabelText(/file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Click the upload button
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));
    
    // Wait for the upload to complete
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });
  });
});