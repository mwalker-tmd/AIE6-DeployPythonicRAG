const { expect } = require('@jest/globals');
require('@testing-library/jest-dom');

// Mock Vite's import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:7860'
    }
  }
};

// Mock browser APIs
global.ReadableStream = class MockReadableStream {
  constructor(underlyingSource) {
    this.underlyingSource = underlyingSource;
    this.controller = {
      enqueue: (chunk) => {
        if (this.underlyingSource && this.underlyingSource.start) {
          this.underlyingSource.start(this.controller);
        }
      },
      close: () => {
        if (this.underlyingSource && this.underlyingSource.cancel) {
          this.underlyingSource.cancel();
        }
      }
    };
  }
  
  getReader() {
    return {
      read: async () => {
        return { value: new Uint8Array(), done: true };
      }
    };
  }
};

global.TextEncoder = class MockTextEncoder {
  encode(string) {
    return new Uint8Array(string.split('').map(char => char.charCodeAt(0)));
  }
};

global.TextDecoder = class MockTextDecoder {
  decode(buffer) {
    return String.fromCharCode.apply(null, buffer);
  }
};

// Mock import.meta.env
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: 'http://localhost:7860'
    }
  },
  writable: true
}); 