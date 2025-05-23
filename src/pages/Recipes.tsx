
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"];

  const recipes = [
    {
      id: 1,
      title: "5-Minute Tempeh Stir Fry",
      category: "Dinner",
      prepTime: "5 min",
      cookTime: "10 min",
      difficulty: "Easy",
      excerpt: "Quick and delicious plant-based protein that doesn't compromise on flavor. Perfect for busy weeknights.",
      image: "photo-1618160702438-9b02ab6515c9",
      tags: ["tempeh", "quick-meals", "protein"]
    },
    {
      id: 2,
      title: "Chocolate Avocado Mousse",
      category: "Dessert",
      prepTime: "10 min",
      cookTime: "0 min",
      difficulty: "Easy",
      excerpt: "Rich, creamy, and surprisingly healthy dessert that will fool even the most skeptical sweet tooth.",
      image: "photo-1582562124811-c09040d0a901",
      tags: ["dessert", "chocolate", "healthy"]
    },
    {
      id: 3,
      title: "Vegan Cheese Platter",
      category: "Snacks",
      prepTime: "15 min",
      cookTime: "0 min",
      difficulty: "Medium",
      excerpt: "Impress your guests with this elegant spread of homemade plant-based cheeses and accompaniments.",
      image: "photo-1550507992-eb63ffee0847",
      tags: ["cheese", "entertaining", "plant-based"]
    },
    {
      id: 4,
      title: "Kimchi Breakfast Bowl",
      category: "Breakfast",
      prepTime: "5 min",
      cookTime: "5 min",
      difficulty: "Easy",
      excerpt: "Start your day with a probiotic-rich bowl that combines the tangy kick of kimchi with protein-packed tofu.",
      image: "photo-1547592180-85f173990888",
      tags: ["kimchi", "breakfast", "bowl"]
    },
    {
      id: 5,
      title: "Kombucha Smoothie Bowl",
      category: "Breakfast",
      prepTime: "10 min",
      cookTime: "0 min",
      difficulty: "Easy",
      excerpt: "A refreshing smoothie bowl featuring the subtle tang of homemade kombucha and seasonal fruits.",
      image: "photo-1577805947697-89e18249d767",
      tags: ["kombucha", "smoothie", "breakfast"]
    },
    {
      id: 6,
      title: "Tempeh Reuben Sandwich",
      category: "Lunch",
      prepTime: "10 min",
      cookTime: "8 min",
      difficulty: "Medium",
      excerpt: "A plant-based spin on the classic sandwich with marinated tempeh, sauerkraut and homemade dressing.",
      image: "photo-1603046891744-76e6481cf539",
      tags: ["tempeh", "sandwich", "lunch"]
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              #NoFuss Recipes
            </h1>
            <p className="text-xl text-gray-600">
              Simple, delicious plant-based recipes that anyone can make
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
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
                  className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${recipe.image}?w=400&h=300&fit=crop`}
                    alt={recipe.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{recipe.category}</Badge>
                      <span className="text-sm text-gray-500">{recipe.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600">{recipe.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Prep: {recipe.prepTime}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Cook: {recipe.cookTime}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <Link to={`/recipes/${recipe.id}`}>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                          View Recipe
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recipes found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Recipes;
