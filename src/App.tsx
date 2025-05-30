
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import { CartProvider } from "./components/ShoppingCart";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPostEditor from "./pages/BlogPostEditor"; // Import BlogPostEditor
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeEditor from "./pages/RecipeEditor";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute"; // Import AdminProtectedRoute
import NotAuthorizedPage from "./pages/NotAuthorizedPage"; // Import NotAuthorizedPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />

                {/* Admin Protected Routes */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/blog/new" element={<BlogPostEditor />} />
                  <Route path="/blog/:id/edit" element={<BlogPostEditor />} />
                  <Route path="/recipes/new" element={<RecipeEditor />} />
                  <Route path="/recipes/:id/edit" element={<RecipeEditor />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider> {/* Close AuthProvider */}
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
