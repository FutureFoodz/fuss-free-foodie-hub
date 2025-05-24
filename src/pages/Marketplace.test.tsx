import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import Marketplace from './Marketplace';
import { mockProductsData, MockProduct } from '../__mocks__/products'; // Adjusted path
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/ShoppingCart';
import { Toaster } from "@/components/ui/toaster"; // For useToast

// Mock the t function from i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string, _options?: any, fallback?: string) => fallback || key,
}));

// Mock ThemeProvider's useTheme hook
jest.mock('@/components/ThemeProvider', () => ({
  ...jest.requireActual('@/components/ThemeProvider'),
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    language: 'en',
    setLanguage: jest.fn(),
    toggleTheme: jest.fn(),
  }),
}));

// Mock useToast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock ShoppingCart component as it's complex and not the focus of these tests
jest.mock('@/components/ShoppingCart', () => ({
  ...jest.requireActual('@/components/ShoppingCart'), // Keep CartProvider
  ShoppingCart: () => <div data-testid="mock-shopping-cart">Cart</div>, // Mocked UI for ShoppingCart
}));


const renderMarketplace = () => {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <CartProvider>
          <Marketplace />
          <Toaster /> {/* Required for useToast hook to function */}
        </CartProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Marketplace Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockToast.mockClear();
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches and displays all products successfully', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));
    renderMarketplace();

    await waitFor(() => {
      mockProductsData.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });
    // Check if the correct number of products is displayed
    // Assuming product names are within h3 tags or have a specific role
    const productHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(productHeadings.length).toBe(mockProductsData.length);
  });

  test('filters products by category', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));
    renderMarketplace();

    // Wait for all products to load initially
    await waitFor(() => expect(screen.getAllByRole('heading', {level: 3}).length).toBe(mockProductsData.length));
    
    const proteinCategory = 'Protein';
    const proteinProducts = mockProductsData.filter(p => p.category === proteinCategory);

    // Find and click the "Protein" category button
    // The button text might be just "Protein" or "Category: Protein"
    // Using a flexible matcher:
    const categoryButton = screen.getByRole('button', { name: proteinCategory });
    fireEvent.click(categoryButton);

    await waitFor(() => {
      proteinProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
      
      const nonProteinProducts = mockProductsData.filter(p => p.category !== proteinCategory);
      nonProteinProducts.forEach(product => {
        expect(screen.queryByText(product.name)).not.toBeInTheDocument();
      });
      
      // Check count
      const productHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(productHeadings.length).toBe(proteinProducts.length);
    });
  });

  test('filters products by search term (name)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));
    renderMarketplace();
    
    await waitFor(() => expect(screen.getAllByRole('heading', {level: 3}).length).toBe(mockProductsData.length));

    const searchTerm = 'Tempeh'; // "Artisanal Tempeh"
    const tempehProduct = mockProductsData.find(p => p.name.includes(searchTerm));

    const searchInput = screen.getByPlaceholderText(/Search products.../i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    await waitFor(() => {
      expect(screen.getByText(tempehProduct!.name)).toBeInTheDocument();
      
      const otherProducts = mockProductsData.filter(p => !p.name.includes(searchTerm));
      otherProducts.forEach(product => {
        expect(screen.queryByText(product.name)).not.toBeInTheDocument();
      });
       // Check count
      const productHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(productHeadings.length).toBe(1);
    });
  });

  test('filters products by search term (description)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));
    renderMarketplace();

    await waitFor(() => expect(screen.getAllByRole('heading', {level: 3}).length).toBe(mockProductsData.length));

    const searchTerm = 'ethically sourced'; // "Dark Chocolate Bliss"
    const chocolateProduct = mockProductsData.find(p => p.description.includes(searchTerm));

    const searchInput = screen.getByPlaceholderText(/Search products.../i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    await waitFor(() => {
      expect(screen.getByText(chocolateProduct!.name)).toBeInTheDocument();
      
      const otherProducts = mockProductsData.filter(p => !p.description.includes(searchTerm));
      otherProducts.forEach(product => {
        expect(screen.queryByText(product.name)).not.toBeInTheDocument();
      });
      const productHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(productHeadings.length).toBe(1);
    });
  });

  test('displays "No products found" message when search yields no results', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));
    renderMarketplace();
    
    await waitFor(() => expect(screen.getAllByRole('heading', {level: 3}).length).toBe(mockProductsData.length));

    const searchTerm = "NonExistentProductXYZZY";
    const searchInput = screen.getByPlaceholderText(/Search products.../i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    await waitFor(() => {
      expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    });
    // Ensure no product cards are rendered
    const productHeadings = screen.queryAllByRole('heading', { level: 3 });
    expect(productHeadings.length).toBe(0);
  });
  
  test('handles fetch error for products gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('API is down'));
    renderMarketplace();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching products:",
        expect.any(Error) // Or expect.objectContaining({ message: 'API is down' })
      );
    });
    
    // Check that no products are displayed
    mockProductsData.forEach(product => {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument();
    });
    // Check for the "No products found" message, as this might be the fallback UI
    // or a specific error message if implemented.
    // The current implementation of Marketplace.tsx shows "No products found." when filteredProducts is empty,
    // which will be the case if the fetch fails and allProducts remains empty.
    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });
});
