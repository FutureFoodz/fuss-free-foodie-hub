import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"; // For useToast context

// Mock Firebase and its auth methods via the manual mock in src/lib/__mocks__/firebase.ts
import { __mockAuth } from '@/lib/__mocks__/firebase'; // Get direct access to the mockAuth object

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string, _options?: any, fallback?: string) => fallback || key,
}));

// Mock ThemeProvider's useTheme hook (if LoginPage or children use it)
jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'light',
    language: 'en',
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Helper component for testing navigation
const TestHomePage = () => <div>Welcome to Home!</div>;

const renderLoginPage = () => {
  // Reset onAuthStateChanged mocks for each render to prevent interference
  __mockAuth.onAuthStateChanged.mockImplementation((callback) => {
    // Simulate no user initially for login page
    callback(null);
    return jest.fn(); // Return an unsubscribe function
  });
  
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<TestHomePage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </MemoryRouter>
  );
};


describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockToast.mockClear();
    __mockAuth.signInWithEmailAndPassword.mockClear();
    __mockAuth.signInWithPopup.mockClear();
    // Reset the user for each test, important for onAuthStateChanged behavior
    __mockAuth.__setMockCurrentUser(null); 
    __mockAuth.__clearAuthStateListeners(); // Clear listeners from previous tests
  });

  test('renders login form correctly', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login with Google/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  test('successful email/password login', async () => {
    __mockAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-uid', email: 'test@example.com' },
    } as any); // Mock successful Firebase login

    renderLoginPage();

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(__mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // The auth object from getAuth()
        'test@example.com',
        'password123'
      );
    });
    
    // Wait for state update and navigation
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Login Successful",
        description: "Welcome back!",
      });
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  test('failed email/password login shows error toast', async () => {
    const errorMessage = 'Invalid credentials';
    __mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce({
      message: errorMessage,
      code: 'auth/wrong-password',
    });

    renderLoginPage();

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
    });
    expect(screen.getByText(errorMessage)).toBeInTheDocument(); // Check if error is displayed on page
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('successful Google login', async () => {
    __mockAuth.signInWithPopup.mockResolvedValueOnce({
      user: { uid: 'google-uid', email: 'googleuser@example.com' },
    } as any); // Mock successful Google login

    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /Login with Google/i }));

    await waitFor(() => {
      expect(__mockAuth.signInWithPopup).toHaveBeenCalledWith(
        expect.anything(), // Auth object
        expect.anything()  // GoogleAuthProvider instance
      );
    });
    
    await waitFor(() => {
       expect(mockToast).toHaveBeenCalledWith({
        title: "Login Successful",
        description: "Welcome!",
      });
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  test('failed Google login shows error toast', async () => {
    const errorMessage = 'Google sign-in failed';
    __mockAuth.signInWithPopup.mockRejectedValueOnce({
      message: errorMessage,
      code: 'auth/popup-closed-by-user',
    });

    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /Login with Google/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
    });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('inputs are updated correctly', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    expect(emailInput.value).toBe('new@example.com');

    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    expect(passwordInput.value).toBe('newpassword');
  });
});
