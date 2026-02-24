
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import App from './App';

test('renders static text', () => {
  render(<App />);
  // Check for the heading in the component
  expect(screen.getByText(/Komplettering – Fullstack/i)).toBeInTheDocument();
});

test('renders API message', async () => {
  // Mock fetch to return a successful response
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'Testmeddelande' })
    })
  );
  render(<App />);
  // Wait for API call and check for message
  const message = await screen.findByText(/API svarar: Testmeddelande/i);
  expect(message).toBeInTheDocument();
  global.fetch.mockRestore && global.fetch.mockRestore();
});
