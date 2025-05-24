
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: string;
  inStock: boolean;
  details: string;
  featured: boolean;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((allProducts: Product[]) => {
        const filteredProducts = allProducts.filter(
          (product) => product.featured
        );
        setFeaturedProducts(filteredProducts);
      })
      .catch((error) => console.error("Error fetching featured products:", error));
  }, []);

  const blogPosts = [
    {
      title: "5-Minute Tempeh Stir Fry",
      category: "Recipes",
      readTime: "3 min read",
      excerpt: "Quick and delicious plant-based protein that doesn't compromise on flavor."
    },
    {
      title: "DIY Kombucha at Home",
      category: "DIY",
      readTime: "8 min read",
      excerpt: "Learn to brew your own probiotic-rich kombucha with simple ingredients."
    },
    {
      title: "The Science of Fermentation",
      category: "Education",
      readTime: "6 min read",
      excerpt: "Discover how ancient preservation methods create modern superfoods."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - More fluid design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-20 md:py-32">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-200 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-200 opacity-40 blur-3xl"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="inline-flex items-center rounded-full px-4 py-1 text-sm bg-green-100 text-green-800 hover:bg-green-200">
                  #NoFuss Plant-Based Delights
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Future-Forward
                  <span className="block text-green-600">Food Innovation</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover artisanal tempeh, rich chocolates, creamy vegan cheeses, 
                  and fermented delights that nourish your body and respect our planet.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace">
                  <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 rounded-full">
                    Explore Products
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 rounded-full">
                    Read Our Blog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-green-200 to-emerald-200 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] opacity-20 blur-lg"></div>
              <img
                src={`https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop`}
                alt="Fresh plant-based foods"
                className="w-full h-96 object-cover rounded-[30px] shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Plant-Based</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with more organic shapes */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-green-50 opacity-70 blur-2xl -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe in creating delicious, nutritious foods that are good for you and good for the planet. 
              Our #NoFuss philosophy means simple ingredients, transparent processes, and maximum flavor.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products with softer design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-green-100 opacity-50 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handcrafted with love, delivered fresh to your door
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-xl border-0 shadow-sm">
                <div className="aspect-video overflow-hidden rounded-t-xl">
                  <img
                    src={`https://images.unsplash.com/${product.image}?w=400&h=300&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full">{product.category}</Badge>
                      <span className="text-lg font-bold text-green-600">{product.price}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 rounded-full">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 rounded-full">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview with organic design */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-50 opacity-60 blur-3xl translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest from Our Blog
            </h2>
            <p className="text-lg text-gray-600">
              Recipes, DIY guides, and plant-based wisdom
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 rounded-xl border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full">{post.category}</Badge>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <Button variant="ghost" className="w-full text-green-600 hover:bg-green-50 rounded-full">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/blog">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 rounded-full">
                Read All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with fluid design */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-500 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-500 opacity-30 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Go #NoFuss?
            </h2>
            <p className="text-xl text-green-100">
              Join thousands of happy customers who've made the switch to sustainable, delicious plant-based foods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-full">
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-600 rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
