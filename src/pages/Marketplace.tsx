
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, useCart } from "@/components/ShoppingCart";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  inStock: boolean;
  details: string;
  featured?: boolean; // featured is optional in the marketplace view
}

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { language } = useTheme();

  const categories = ["All", "Protein", "Fermented", "Treats", "Beverages", "Dairy Alternatives"];

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data: Product[]) => setAllProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
    
    toast({
      title: t("cart.itemAdded", language) || "Added to cart",
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Plant-Based Marketplace
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fresh, artisanal, and sustainably made foods delivered to your door
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "dark:border-gray-600 dark:text-gray-300"}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Search and Cart */}
            <div className="flex w-full md:w-auto items-center gap-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-64 dark:bg-gray-700 dark:border-gray-600"
              />
              <ShoppingCart />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800 h-full">
                <Link to={`/marketplace/${product.id}`} className="block">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${product.image}?w=300&h=300&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-4 flex flex-col h-[calc(100%-50%)]">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{product.price}</span>
                    </div>
                    <Link to={`/marketplace/${product.id}`}>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{product.description}</p>
                  </div>
                  <div className="pt-2 mt-2 border-t dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${product.inStock 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-500'}`}
                      >
                        {product.inStock 
                          ? t("product.inStock", language) || "In Stock" 
                          : t("product.outOfStock", language) || "Out of Stock"}
                      </span>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-xs h-8"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        {t("action.addToCart", language) || "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-green-100">
              We're always adding new products. Contact us about custom orders or special requests.
            </p>
            <Button size="lg" variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
