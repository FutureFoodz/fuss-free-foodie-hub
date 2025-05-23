
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/ShoppingCart";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
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
