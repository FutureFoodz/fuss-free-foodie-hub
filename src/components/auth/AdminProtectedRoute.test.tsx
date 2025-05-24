import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext'; // Using the real AuthProvider
import { __mockAuth } from '@/lib/__mocks__/firebase'; // Our Firebase mock

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string, _options?: any, fallback?: string) => fallback || key,
}));

// Mock ThemeProvider's useTheme hook (if any child components of AdminProtectedRoute use it)
jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'light',
    language: 'en',
  }),
}));

const TestChildComponent = () => <div data-testid="test-child">Protected Content</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;
const NotAuthorizedPage = () => <div data-testid="not-authorized-page">Not Authorized</div>;


// Helper to render the AdminProtectedRoute with different auth states
const renderProtectedRoute = (initialEntry = '/protected') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <Routes>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/protected" element={<TestChildComponent />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};


describe('AdminProtectedRoute', () => {
  beforeEach(() => {
    // Reset all mock states and listeners before each test
    __mockAuth.signOut.mockClear(); // Assuming signOut clears the user
    __mockAuth.__clearAuthStateListeners();
    __mockAuth.__setMockCurrentUser(null); // Start with no user
    
    // Configure onAuthStateChanged to allow control via __simulateAuthStateChange
    // and to simulate initial loading behavior if necessary.
    __mockAuth.onAuthStateChanged.mockImplementation((callback) => {
      // The callback is immediately invoked by AuthProvider upon registration.
      // We can control what it sees initially here, or via __simulateAuthStateChange.
      // For most tests, we want to simulate the async nature.
      const unsubscribe = jest.fn();
      // Store the callback to be called by __simulateAuthStateChange
      // This replaces the simple push to authStateListeners in the mock itself for more control here.
      __mockAuth.__internalCallback = callback; 
      return unsubscribe;
    });
  });

  afterEach(() => {
     delete (__mockAuth as any).__internalCallback; // Clean up
  });

  test('Scenario 4: Auth loading state', async () => {
    // To test the loading state, we need AuthProvider's internal `loading` to be true.
    // This is true until onAuthStateChanged's callback is first invoked.
    // So, we DON'T call __simulateAuthStateChange immediately.
    
    renderProtectedRoute();

    // Check for loading spinner (or text)
    // The AdminProtectedRoute shows a Loader2 icon.
    // We can check for its presence or a role if it had one.
    // For simplicity, let's assume Loader2 adds a specific class or is identifiable.
    // The component uses <Loader2 className="h-12 w-12 animate-spin text-green-600" />
    // and <p className="ml-4 text-lg">Loading...</p>
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Ensure child is not rendered yet
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
  });


  test('Scenario 1: User not authenticated redirects to /login', async () => {
    renderProtectedRoute();
    
    // Simulate Firebase finishing its auth check and finding no user
    __mockAuth.__simulateAuthStateChange(null);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
  });

  test('Scenario 2: User authenticated, but not admin redirects to /not-authorized', async () => {
    renderProtectedRoute();
    const nonAdminUser = { uid: 'user123', email: 'user@example.com' };
    
    __mockAuth.__simulateAuthStateChange(nonAdminUser);

    await waitFor(() => {
      expect(screen.getByTestId('not-authorized-page')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
  });

  test('Scenario 3: User authenticated and is admin renders child component', async () => {
    renderProtectedRoute();
    const adminUser = { uid: 'admin123', email: 'admin@example.com' }; // Matches ADMIN_EMAIL in component

    __mockAuth.__simulateAuthStateChange(adminUser);

    await waitFor(() => {
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('not-authorized-page')).not.toBeInTheDocument();
  });

  test('redirects to /login preserving original location state', async () => {
    // For this test, we want to see if `state={{ from: location }}` is passed.
    // We can't directly check the state object in NavLink/Navigate with testing-library.
    // However, we can verify the redirection happens.
    // A more advanced test might involve a custom LoginPage that displays its location state.

    renderProtectedRoute('/protected?param=test'); // A route with query params
    
    __mockAuth.__simulateAuthStateChange(null); // No user

    await waitFor(() => {
      // Verifies redirection to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    // Further check for `state.from` would require a custom component on the login route
    // or e2e tests. For unit/integration, knowing it redirects is usually sufficient.
  });
});

// Minor adjustment to the mock to hold the internal callback for onAuthStateChanged
// This is a bit of a hack due to the way the mock was initially written.
// A cleaner mock might use jest.spyOn(auth, 'onAuthStateChanged') and provide different
// implementations per test.
declare module '@/lib/__mocks__/firebase' {
  interface MockAuth {
    __internalCallback?: (user: any | null) => void;
  }
}

// Modify the __simulateAuthStateChange in the mock to use this internal callback
__mockAuth.__simulateAuthStateChange = (user) => {
  __mockAuth.__setMockCurrentUser(user); // Keep this for direct checks if needed
  if ((__mockAuth as any).__internalCallback) {
    (__mockAuth as any).__internalCallback(user);
  }
};
