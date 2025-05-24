// src/lib/__mocks__/firebase.ts

// Mock user type, can be expanded if needed for tests
type MockUser = {
  uid: string;
  email: string | null;
  // Add other user properties if your components use them
};

let mockCurrentUser: MockUser | null = null;
let authStateListeners: Array<(user: MockUser | null) => void> = [];

const mockAuth = {
  // onAuthStateChanged: (callback: (user: MockUser | null) => void) => {
  //   authStateListeners.push(callback);
  //   // Immediately call with current mock user
  //   callback(mockCurrentUser);
  //   // Return an unsubscribe function
  //   return () => {
  //     authStateListeners = authStateListeners.filter(listener => listener !== callback);
  //   };
  // },
  // A more controllable version of onAuthStateChanged for testing different states:
  onAuthStateChanged: jest.fn((callback: (user: MockUser | null) => void) => {
    authStateListeners.push(callback);
    // Simulate initial state if needed, or let tests call __simulateAuthStateChange
    // callback(mockCurrentUser); 
    return () => {
      authStateListeners = authStateListeners.filter(listener => listener !== callback);
    };
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn().mockImplementation(() => {
    // Simulate sign out for onAuthStateChanged listeners
    mockCurrentUser = null;
    authStateListeners.forEach(listener => listener(null));
    return Promise.resolve();
  }),
  // Helper to simulate auth state change for tests
  __simulateAuthStateChange: (user: MockUser | null) => {
    mockCurrentUser = user;
    authStateListeners.forEach(listener => listener(user));
  },
  __clearAuthStateListeners: () => {
    authStateListeners = [];
  },
  __getMockCurrentUser: () => mockCurrentUser,
  __setMockCurrentUser: (user: MockUser | null) => { // Added for direct manipulation if needed
    mockCurrentUser = user;
  }
};

const initializeApp = jest.fn().mockReturnValue({}); // Mock app instance
const getAuth = jest.fn().mockReturnValue(mockAuth);
const GoogleAuthProvider = jest.fn();


export {
  initializeApp,
  getAuth,
  auth, // Export 'auth' directly if your app uses it like 'import { auth } from "@/lib/firebase"'
  GoogleAuthProvider,
  // Export the mockAuth object itself if tests need to access its jest.fn() properties directly
  mockAuth as __mockAuth // For direct access to jest.fn mocks in tests
};

// Ensure 'auth' is the mockAuth instance.
// This is common if the actual firebase.ts exports a const auth = getAuth(app);
const auth = mockAuth;
