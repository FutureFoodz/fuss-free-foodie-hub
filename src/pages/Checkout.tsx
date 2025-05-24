
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/ShoppingCart";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { Link } from "react-router-dom"; // Import Link
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Loader2 } from "lucide-react"; // For loading spinner
import { CartItemList } from "@/components/checkout/CartItemList";
import { ShippingDetailsForm, ShippingDetails } from "@/components/checkout/ShippingDetailsForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { EmptyCart } from "@/components/checkout/EmptyCart";

const Checkout = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { language } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, loading: authLoading } = useAuth(); // Get auth state
  
  // Calculate totalAmount as a number from the total string
  const totalAmount = parseFloat(total.replace(/[^\d.-]/g, ''));

  const handleQuantityChange = (id: string | number, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order submission
    setTimeout(() => {
      toast({
        title: t("checkout.orderSuccess", language) || "Order Placed Successfully",
        description: t("checkout.orderConfirmationEmail", language) || "You will receive a confirmation email shortly.",
      });
      clearCart();
      setIsSubmitting(false);
      navigate("/"); // Redirect to home page after order
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t("checkout.title", language) || "Checkout"}
          </h1>

          {/* Auth Status Message Section */}
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            {authLoading ? (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>{t("checkout.authLoading", language) || "Checking authentication status..."}</span>
              </div>
            ) : currentUser ? (
              <p className="text-green-700 dark:text-green-400">
                {t("checkout.loggedInMessage", language, { email: currentUser.email }) || `Welcome, ${currentUser.email}! You are checking out as a logged-in user.`}
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {t("checkout.guestMessage", language) || "You are checking out as a guest. Optionally, you can "}
                <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
                  {t("checkout.loginLink", language) || "Login"}
                </Link>
                {t("checkout.or", language) || " or "}
                <Link to="/signup" className="text-green-600 hover:text-green-500 font-medium">
                  {t("checkout.signupLink", language) || "Sign Up"}
                </Link>
                .
              </p>
            )}
          </div>
          
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CartItemList
                  items={items}
                  onRemove={removeItem}
                  onQuantityChange={handleQuantityChange}
                />
                
                <ShippingDetailsForm 
                  shippingDetails={shippingDetails}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="lg:col-span-1">
                <OrderSummary
                  subtotal={totalAmount}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
