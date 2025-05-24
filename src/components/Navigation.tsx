
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Globe, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Logout Error", description: "Failed to log out. Please try again.", variant: "destructive" });
    }
  };

  const baseNavItems = [
    { name: t("nav.home", language), path: "/" },
    { name: t("nav.blog", language), path: "/blog" },
    { name: t("nav.recipes", language), path: "/recipes" },
    { name: t("nav.marketplace", language), path: "/marketplace" },
    { name: t("nav.about", language), path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">FutureFoodz</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {baseNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  isActive(item.path)
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-full">
              #NoFuss
            </Button>
          </div>

          {/* Right side - Auth buttons, Theme and Language toggles */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {/* Auth Buttons */}
            {currentUser ? (
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="text-sm font-medium rounded-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="mr-2 h-4 w-4" /> {t("nav.logout", language) || "Logout"}
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    {t("nav.login", language) || "Login"}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-full">
                    {t("nav.signup", language) || "Signup"}
                  </Button>
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label={theme === "light" ? t("theme.dark", language) : t("theme.light", language)}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Change language"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  <span className={language === "en" ? "font-bold" : ""}>
                    {t("language.en", language)}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("sv")}>
                  <span className={language === "sv" ? "font-bold" : ""}>
                    {t("language.sv", language)}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label={theme === "light" ? t("theme.dark", language) : t("theme.light", language)}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Change language"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  <span className={language === "en" ? "font-bold" : ""}>
                    {t("language.en", language)}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("sv")}>
                  <span className={language === "sv" ? "font-bold" : ""}>
                    {t("language.sv", language)}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {baseNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 text-lg font-medium transition-colors hover:text-green-600 ${
                        isActive(item.path) 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  {currentUser ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-green-600"
                    >
                       <LogOut className="mr-2 h-5 w-5" /> {t("nav.logout", language) || "Logout"}
                    </Button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-green-600"
                      >
                        {t("nav.login", language) || "Login"}
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-green-600"
                      >
                        {t("nav.signup", language) || "Signup"}
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
