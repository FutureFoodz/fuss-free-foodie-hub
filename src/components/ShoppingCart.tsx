
import { useState, createContext, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart as CartIcon, Plus, Minus, X, ShoppingBag } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string | number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
  itemCount: number;
  total: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  useEffect(() => {
    // Save to localStorage whenever cart changes
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      if (existingItem) {
        // Update quantity if item already exists
        return currentItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      } else {
        // Add new item
        return [...currentItems, item];
      }
    });
  };
  
  const updateQuantity = (id: string | number, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
  };
  
  const removeItem = (id: string | number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  // Calculate total items and price
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return sum + (price * item.quantity);
  }, 0).toFixed(2);
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      updateQuantity, 
      removeItem, 
      clearCart,
      itemCount,
      total: `$${total}`
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const ShoppingCart = () => {
  const { items, updateQuantity, removeItem, clearCart, itemCount, total } = useCart();
  const { language } = useTheme();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleCheckout = () => {
    toast({
      title: "Checkout started",
      description: `Total: ${total} for ${itemCount} items`,
    });
    setIsOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-none"
          aria-label="Shopping Cart"
        >
          <CartIcon className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center bg-green-600 hover:bg-green-600">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-[90vw]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("cart.title", language) || "Shopping Cart"}
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="text-center space-y-2">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium dark:text-white">
                {t("cart.empty", language) || "Your cart is empty"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("cart.emptyMessage", language) || "Add some products to your cart"}
              </p>
              <SheetClose asChild>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  {t("cart.continueShopping", language) || "Continue Shopping"}
                </Button>
              </SheetClose>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {t("cart.clearAll", language) || "Clear All"}
              </Button>
            </div>
            
            <div className="space-y-4 pr-6 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 py-3 border-b dark:border-gray-700">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={`https://images.unsplash.com/${item.image}?w=100&h=100&fit=crop`} 
                      className="h-full w-full object-cover"
                      alt={item.name}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium dark:text-white">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-auto p-0 text-gray-400 hover:text-gray-900"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.category}</div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-r-none"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="font-medium dark:text-white">
                        {item.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <SheetFooter className="absolute bottom-0 left-0 right-0 border-t dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
              <div className="w-full space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-white">
                    {t("cart.subtotal", language) || "Subtotal"}:
                  </span>
                  <span className="font-bold text-lg dark:text-white">{total}</span>
                </div>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                >
                  {t("cart.checkout", language) || "Checkout"} ({itemCount})
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
