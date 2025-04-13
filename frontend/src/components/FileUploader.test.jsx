import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploader from './FileUploader';

jest.mock('../utils/env', () => ({
  getApiUrl: () => 'http://localhost:7860'
}))

global.fetch = jest.fn();

describe('FileUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders the file upload interface', () => {
    render(<FileUploader onUploadSuccess={() => {}} />);
    expect(screen.getByLabelText('File:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows uploading status during file upload', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'File uploaded successfully' })
    });

    render(<FileUploader onUploadSuccess={() => {}} />);

    const fileInput = screen.getByLabelText('File:');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    fireEvent.submit(screen.getByRole('form'));

    expect(uploadButton).toBeDisabled();
    expect(uploadButton).toHaveTextContent('Uploading...');

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('File uploaded successfully');
    });
  });

  it('handles upload failure gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    render(<FileUploader onUploadSuccess={() => {}} />);
    const fileInput = screen.getByLabelText('File:');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('Error: HTTP error! status: 500');
    });

    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    expect(uploadButton).not.toBeDisabled();
    expect(uploadButton).toHaveTextContent('Upload');
  });

  it('shows error message when file upload fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<FileUploader onUploadSuccess={() => {}} />);
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('File:'), { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('Error: Network error');
    });
  });

  it('shows success message when file is uploaded successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'File uploaded successfully!' })
    });

    render(<FileUploader onUploadSuccess={() => {}} />);
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('File:'), { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('File uploaded successfully!');
    });
  });

  it('displays message if form is submitted without selecting a file', async () => {
    render(<FileUploader onUploadSuccess={() => {}} />);
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByTestId('upload-message')).toHaveTextContent('Please select a file first');
    });
  });

  it('calls onUploadSuccess after successful upload', async () => {
    const onSuccess = jest.fn();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Done!' }),
    });

    render(<FileUploader onUploadSuccess={onSuccess} />);
    const file = new File(['123'], 'foo.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('File:'), { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
