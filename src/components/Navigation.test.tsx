import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from './Navigation'; // Assuming Navigation is directly exported
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Using real AuthProvider and mocking useAuth for specific states
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster"; // For useToast context

// Mock Firebase to prevent actual Firebase calls from AuthProvider
// We will control AuthProvider's state via the useAuth mock for these specific tests
import { __mockAuth } from '@/lib/__mocks__/firebase';


// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string, _options?: any, fallback?: string) => {
    if (key === 'nav.login') return 'Login';
    if (key === 'nav.signup') return 'Signup';
    if (key === 'nav.logout') return 'Logout';
    if (key === 'nav.home') return 'Home';
    // Add other keys as needed by Navigation or its children
    return fallback || key;
  },
}));

// Mock useTheme as it's used by Navigation
jest.mock('@/components/ThemeProvider', () => ({
  ...jest.requireActual('@/components/ThemeProvider'), // Keep ThemeProvider itself
  useTheme: jest.fn(() => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    language: 'en',
    setLanguage: jest.fn(),
  })),
}));

// Mock useAuth: This is the primary way we'll control auth state for Navigation tests
let mockCurrentUser: { email: string; uid: string } | null = null;
let mockAuthLoading: boolean = false;
const mockLogout = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'), // Keep AuthProvider
  useAuth: jest.fn(() => ({
    currentUser: mockCurrentUser,
    loading: mockAuthLoading,
    logout: mockLogout,
    // Other auth functions if Navigation ever uses them directly
    signupWithEmail: jest.fn(),
    loginWithEmail: jest.fn(),
    loginWithGoogle: jest.fn(),
  })),
}));


const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const renderNavigation = () => {
  // Ensure onAuthStateChanged in the mock Firebase is set up minimally
  // so AuthProvider doesn't hang or error, even though we override with useAuth mock.
  __mockAuth.onAuthStateChanged.mockImplementation((callback) => {
    callback(mockCurrentUser); // Reflect the current mock user state
    return jest.fn(); // Return an unsubscribe function
  });

  return render(
    <MemoryRouter>
      <ThemeProvider> {/* Theme context for shadcn components */}
        <AuthProvider> {/* Real AuthProvider to host the context, but useAuth is mocked */}
          <Navigation />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Navigation Component - Auth States', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockToast.mockClear();
    (useAuth as jest.Mock).mockImplementation(() => ({ // Reset useAuth mock for each test
        currentUser: mockCurrentUser,
        loading: mockAuthLoading,
        logout: mockLogout,
        signupWithEmail: jest.fn(),
        loginWithEmail: jest.fn(),
        loginWithGoogle: jest.fn(),
    }));
  });

  describe('User is not authenticated', () => {
    beforeAll(() => {
      mockCurrentUser = null;
      mockAuthLoading = false;
    });

    test('renders Login and Signup links when user is not authenticated', () => {
      renderNavigation();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Signup')).toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  describe('User is authenticated', () => {
    beforeAll(() => {
      mockCurrentUser = { email: 'test@example.com', uid: 'test-uid' };
      mockAuthLoading = false;
    });
     afterAll(() => { // Reset for other describe blocks
      mockCurrentUser = null;
    });


    test('renders Logout button when user is authenticated', () => {
      renderNavigation();
      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Signup')).not.toBeInTheDocument();
    });

    test('calls logout and shows toast on successful logout', async () => {
      mockLogout.mockResolvedValueOnce(undefined); // Simulate successful logout
      renderNavigation();

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Logged Out',
          description: 'You have been successfully logged out.',
        });
      });
    });

    test('shows error toast on failed logout', async () => {
      mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
      renderNavigation();

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Logout Error',
          description: 'Failed to log out. Please try again.',
          variant: 'destructive',
        });
      });
    });
  });
  
  describe('Auth is loading', () => {
    beforeAll(() => {
        mockCurrentUser = null;
        mockAuthLoading = true;
    });
    afterAll(() => { // Reset for other describe blocks
      mockAuthLoading = false;
    });

    test('renders Login and Signup links even when auth is loading (default non-authed view)', () => {
      // The Navigation component doesn't currently have a distinct "loading" view for auth.
      // It defaults to showing Login/Signup if currentUser is null, regardless of loading.
      // This test confirms that behavior.
      renderNavigation();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Signup')).toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });
});
