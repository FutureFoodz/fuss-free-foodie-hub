import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SignupPage from './SignupPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";

// Mock Firebase and its auth methods
import { __mockAuth } from '@/lib/__mocks__/firebase';

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string, _options?: any, fallback?: string) => fallback || key,
}));

// Mock ThemeProvider's useTheme hook
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

const TestHomePage = () => <div>Welcome to Home!</div>;

const renderSignupPage = () => {
   // Reset onAuthStateChanged mocks for each render
  __mockAuth.onAuthStateChanged.mockImplementation((callback) => {
    callback(null); // Simulate no user initially
    return jest.fn(); // Return an unsubscribe function
  });

  return render(
    <MemoryRouter initialEntries={['/signup']}>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<TestHomePage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('SignupPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockToast.mockClear();
    __mockAuth.createUserWithEmailAndPassword.mockClear();
    __mockAuth.__setMockCurrentUser(null);
    __mockAuth.__clearAuthStateListeners();
  });

  test('renders signup form correctly', () => {
    renderSignupPage();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
  });

  test('successful signup', async () => {
    __mockAuth.createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'new-uid', email: 'newuser@example.com' },
    } as any);

    renderSignupPage();

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(__mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // Auth object
        'newuser@example.com',
        'password123'
      );
    });
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Signup Successful",
        description: "You have successfully created an account.",
      });
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  test('shows error if passwords do not match', async () => {
    renderSignupPage();

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Signup Error',
        description: "Passwords don't match!",
        variant: 'destructive',
      });
    });
    expect(screen.getByText("Passwords don't match!")).toBeInTheDocument();
    expect(__mockAuth.createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('failed signup (e.g., email already in use) shows error toast', async () => {
    const errorMessage = 'Email already in use';
    __mockAuth.createUserWithEmailAndPassword.mockRejectedValueOnce({
      message: errorMessage,
      code: 'auth/email-already-in-use',
    });

    renderSignupPage();

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Signup Error',
        description: errorMessage,
        variant: 'destructive',
      });
    });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('inputs are updated correctly', () => {
    renderSignupPage();
    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^Password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i) as HTMLInputElement;


    fireEvent.change(emailInput, { target: { value: 'another@example.com' } });
    expect(emailInput.value).toBe('another@example.com');

    fireEvent.change(passwordInput, { target: { value: 'securepass' } });
    expect(passwordInput.value).toBe('securepass');
    
    fireEvent.change(confirmPasswordInput, { target: { value: 'securepass' } });
    expect(confirmPasswordInput.value).toBe('securepass');
  });
});
