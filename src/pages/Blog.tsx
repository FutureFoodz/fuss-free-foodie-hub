
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { language } = useTheme();

  const categories = ["All", "Recipes", "DIY", "Education", "Events"];

  const blogPosts = [
    {
      id: 1,
      title: "5-Minute Tempeh Stir Fry",
      category: "Recipes",
      readTime: "3 min read",
      excerpt: "Quick and delicious plant-based protein that doesn't compromise on flavor. Perfect for busy weeknights.",
      image: "photo-1618160702438-9b02ab6515c9",
      date: "March 15, 2024",
      tags: ["tempeh", "quick-meals", "protein"]
    },
    {
      id: 2,
      title: "DIY Kombucha at Home",
      category: "DIY",
      readTime: "8 min read",
      excerpt: "Learn to brew your own probiotic-rich kombucha with simple ingredients and basic equipment.",
      image: "photo-1465146344425-f00d5f5c8f07",
      date: "March 12, 2024",
      tags: ["kombucha", "fermentation", "probiotics"]
    },
    {
      id: 3,
      title: "The Science of Fermentation",
      category: "Education",
      readTime: "6 min read",
      excerpt: "Discover how ancient preservation methods create modern superfoods rich in probiotics and nutrients.",
      image: "photo-1506744038136-46273834b3fb",
      date: "March 10, 2024",
      tags: ["science", "fermentation", "health"]
    },
    {
      id: 4,
      title: "Vegan Cheese Making Workshop",
      category: "Events",
      readTime: "2 min read",
      excerpt: "Join us for a hands-on workshop where you'll learn to make artisanal vegan cheeses from scratch.",
      image: "photo-1513836279014-a89f7a76ae86",
      date: "March 8, 2024",
      tags: ["workshop", "cheese", "hands-on"]
    },
    {
      id: 5,
      title: "Chocolate Avocado Mousse",
      category: "Recipes",
      readTime: "4 min read",
      excerpt: "Rich, creamy, and surprisingly healthy dessert that will fool even the most skeptical sweet tooth.",
      image: "photo-1582562124811-c09040d0a901",
      date: "March 5, 2024",
      tags: ["dessert", "chocolate", "healthy"]
    },
    {
      id: 6,
      title: "Building Your Fermentation Station",
      category: "DIY",
      readTime: "10 min read",
      excerpt: "Set up the perfect home fermentation station with our complete guide to equipment and techniques.",
      image: "photo-1721322800607-8c38375eef04",
      date: "March 3, 2024",
      tags: ["setup", "equipment", "fermentation"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              FutureFoodz Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Recipes, DIY guides, and everything you need to know about plant-based living
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

            {/* Search */}
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${post.image}?w=400&h=300&fit=crop`}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700">
                          {t("action.readMore", language)}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
