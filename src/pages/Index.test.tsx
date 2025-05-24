import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import Index from './Index';
import { mockProductsData, MockProduct } from '../__mocks__/products'; // Adjusted path
import { ThemeProvider } from '@/components/ThemeProvider'; // Assuming ThemeProvider is needed

// Mock the t function from i18n as it's used in some child components or for aria-labels
jest.mock('@/lib/i18n', () => ({
  t: (key: string, _options?: any, fallback?: string) => fallback || key,
}));

// Mock ThemeProvider's useTheme hook as Index and its children might use it
jest.mock('@/components/ThemeProvider', () => ({
  ...jest.requireActual('@/components/ThemeProvider'), // Import and retain default behavior
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    language: 'en',
    setLanguage: jest.fn(),
    toggleTheme: jest.fn(),
  }),
}));


describe('Index Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    // Mock console.error to avoid cluttering test output, can be checked if specific errors are expected
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches and displays featured products successfully', async () => {
    const featuredProducts = mockProductsData.filter(p => p.featured);
    fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));

    render(
      <MemoryRouter>
        <ThemeProvider> {/* Added ThemeProvider */}
          <Index />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Wait for products to be fetched and rendered
    await waitFor(() => {
      featuredProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
        expect(screen.getByText(product.description)).toBeInTheDocument();
      });
    });

    // Verify only featured products are shown
    const allRenderedProducts = screen.queryAllByRole('heading', { level: 3 }); // Assuming product names are h3
    
    // A more robust check: Check for presence of featured product names and absence of non-featured ones
    featuredProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
    });

    const nonFeaturedProducts = mockProductsData.filter(p => !p.featured);
    nonFeaturedProducts.forEach(product => {
        // This check needs to be careful if descriptions are similar or if names can be substrings
        // For now, we assume names are unique enough for this test.
        // A better way would be to ensure the card for non-featured product doesn't exist.
        expect(screen.queryByText(product.name)).not.toBeInTheDocument();
    });
    
    // Check count based on a unique element within each product card, like the "Add to Cart" button
    const addToCartButtons = screen.queryAllByRole('button', { name: /Add to Cart/i });
    expect(addToCartButtons.length).toBe(featuredProducts.length);

  });

  test('handles fetch error for featured products gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    render(
      <MemoryRouter>
         <ThemeProvider>
            <Index />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Check that console.error was called with the expected error
    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
            'Error fetching featured products:',
            expect.any(Error) // Or expect.objectContaining({ message: 'Network error' })
        );
    });
    
    // Verify that no products are displayed
    // This depends on how product cards are identified. Assuming product names are good indicators.
    mockProductsData.forEach(product => {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument();
    });

    // Optionally, check for an error message if the component is designed to show one
    // For example: expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    // If no specific UI for error, ensure it doesn't crash and renders other static parts
    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument(); // Static title should still be there
  });
});
