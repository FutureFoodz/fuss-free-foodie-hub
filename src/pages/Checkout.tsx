
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/ShoppingCart";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { Minus, Plus, Trash2 } from "lucide-react";

const Checkout = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { language } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [shippingDetails, setShippingDetails] = useState({
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("checkout.title", language) || "Checkout"}</h1>
          
          {items.length === 0 ? (
            <Card className="border-0 shadow-md dark:bg-gray-800">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t("cart.empty", language) || "Your cart is empty"}</p>
                <Link to="/marketplace">
                  <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                    {t("action.continueShopping", language) || "Continue Shopping"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md dark:bg-gray-800 mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t("cart.yourItems", language) || "Your Items"}</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={`https://images.unsplash.com/${item.image}?w=100&h=100&fit=crop`} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                                <Badge variant="outline" className="mt-1 dark:border-gray-600">{item.category}</Badge>
                              </div>
                              <span className="font-semibold text-green-600 dark:text-green-400">{item.price}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-7 w-7 rounded-full dark:border-gray-600"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-gray-700 dark:text-gray-300 w-6 text-center">{item.quantity}</span>
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-7 w-7 rounded-full dark:border-gray-600"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-transparent"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t("checkout.shippingDetails", language) || "Shipping Details"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("checkout.fullName", language) || "Full Name"}
                          </label>
                          <Input
                            id="name"
                            name="name"
                            required
                            value={shippingDetails.name}
                            onChange={handleInputChange}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("checkout.email", language) || "Email"}
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={shippingDetails.email}
                            onChange={handleInputChange}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("checkout.address", language) || "Address"}
                        </label>
                        <Input
                          id="address"
                          name="address"
                          required
                          value={shippingDetails.address}
                          onChange={handleInputChange}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("checkout.city", language) || "City"}
                          </label>
                          <Input
                            id="city"
                            name="city"
                            required
                            value={shippingDetails.city}
                            onChange={handleInputChange}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("checkout.postalCode", language) || "Postal Code"}
                          </label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            required
                            value={shippingDetails.postalCode}
                            onChange={handleInputChange}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("checkout.country", language) || "Country"}
                          </label>
                          <Input
                            id="country"
                            name="country"
                            required
                            value={shippingDetails.country}
                            onChange={handleInputChange}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("checkout.phone", language) || "Phone Number"}
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          required
                          value={shippingDetails.phone}
                          onChange={handleInputChange}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("checkout.notes", language) || "Order Notes (Optional)"}
                        </label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder={t("checkout.notesPlaceholder", language) || "Special instructions for delivery, allergies, etc."}
                          value={shippingDetails.notes}
                          onChange={handleInputChange}
                          className="resize-none dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-md dark:bg-gray-800 sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t("checkout.orderSummary", language) || "Order Summary"}</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>{t("checkout.subtotal", language) || "Subtotal"}</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>{t("checkout.shipping", language) || "Shipping"}</span>
                        <span>$5.00</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-900 dark:text-white border-t dark:border-gray-700 pt-3 mt-3">
                        <span>{t("checkout.total", language) || "Total"}</span>
                        <span>${(totalAmount + 5).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <Button 
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting 
                          ? (t("checkout.processing", language) || "Processing...") 
                          : (t("checkout.placeOrder", language) || "Place Order")}
                      </Button>
                      <Link to="/marketplace">
                        <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-300">
                          {t("action.continueShopping", language) || "Continue Shopping"}
                        </Button>
                      </Link>
                    </div>
                    
                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                      {t("checkout.securePayment", language) || "Your payment information is processed securely."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
