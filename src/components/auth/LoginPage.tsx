import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);
    try {
      await loginWithEmail(email, password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      navigate("/"); // Redirect to homepage
    } catch (err: any) {
      console.error("Email login error:", err);
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = firebaseError.message || "Failed to login. Please check your credentials.";
      setError(errorMessage);
      toast({ title: "Login Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoadingGoogle(true);
    try {
      await loginWithGoogle();
      toast({ title: "Login Successful", description: "Welcome!" });
      navigate("/"); // Redirect to homepage
    } catch (err: any) {
      console.error("Google login error:", err);
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = firebaseError.message || "Failed to login with Google. Please try again.";
      setError(errorMessage);
      toast({ title: "Login Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
          <div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loadingEmail || loadingGoogle}>
              {loadingEmail ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={handleGoogleLogin} className="w-full" disabled={loadingEmail || loadingGoogle}>
            {loadingGoogle ? "Logging in..." : "Login with Google"}
          </Button>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
