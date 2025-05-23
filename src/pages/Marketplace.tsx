
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, useCart } from "@/components/ShoppingCart";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();
  const { language } = useTheme();

  const categories = ["All", "Protein", "Fermented", "Treats", "Beverages", "Dairy Alternatives"];

  const products = [
    {
      id: 1,
      name: "Artisanal Tempeh",
      description: "Handcrafted fermented soybean goodness with traditional Indonesian methods",
      price: "$12.99",
      category: "Protein",
      image: "photo-1618160702438-9b02ab6515c9",
      inStock: true,
      details: "Organic soybeans, fermented for 48 hours, rich in probiotics and protein"
    },
    {
      id: 2,
      name: "Dark Chocolate Bliss",
      description: "70% cacao, ethically sourced from sustainable farms",
      price: "$8.50",
      category: "Treats",
      image: "photo-1465146344425-f00d5f5c8f07",
      inStock: true,
      details: "Single-origin cacao, no refined sugars, naturally sweetened"
    },
    {
      id: 3,
      name: "Probiotic Kimchi",
      description: "Traditional fermented vegetables packed with beneficial bacteria",
      price: "$9.75",
      category: "Fermented",
      image: "photo-1582562124811-c09040d0a901",
      inStock: true,
      details: "Napa cabbage, Korean chili flakes, naturally fermented for 2 weeks"
    },
    {
      id: 4,
      name: "Kombucha Variety Pack",
      description: "Three flavors of our signature fermented tea",
      price: "$24.99",
      category: "Beverages",
      image: "photo-1506744038136-46273834b3fb",
      inStock: true,
      details: "Ginger Lemon, Berry Hibiscus, and Green Tea varieties"
    },
    {
      id: 5,
      name: "Cashew Cream Cheese",
      description: "Smooth and creamy dairy-free cheese alternative",
      price: "$11.25",
      category: "Dairy Alternatives",
      image: "photo-1513836279014-a89f7a76ae86",
      inStock: false,
      details: "Raw cashews, nutritional yeast, cultured for authentic tangy flavor"
    },
    {
      id: 6,
      name: "Miso Paste Collection",
      description: "Traditional white and red miso for authentic umami",
      price: "$18.50",
      category: "Fermented",
      image: "photo-1721322800607-8c38375eef04",
      inStock: true,
      details: "Aged 6 months, made with organic soybeans and koji starter"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleAddToCart = (product) => {
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
                  className={selectedCategory === category ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : ""}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800">
                <Link to={`/marketplace/${product.id}`} className="block">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${product.image}?w=400&h=300&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{product.category}</Badge>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{product.price}</span>
                    </div>
                    <Link to={`/marketplace/${product.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.details}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${product.inStock 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-500'}`}
                      >
                        {product.inStock 
                          ? t("product.inStock", language) || "In Stock" 
                          : t("product.outOfStock", language) || "Out of Stock"}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/marketplace/${product.id}`}>
                          <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                            {t("product.details", language) || "Details"}
                          </Button>
                        </Link>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product)}
                        >
                          {t("action.addToCart", language) || "Add to Cart"}
                        </Button>
                      </div>
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
