
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { language } = useTheme();

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks", "Drinks"];

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
    },
    {
      id: 7,
      title: "Mushroom Risotto",
      category: "Dinner",
      prepTime: "15 min",
      cookTime: "25 min",
      difficulty: "Medium",
      excerpt: "Creamy, comforting risotto packed with umami flavors from mixed mushrooms and nutritional yeast.",
      image: "photo-1476124369491-e7addf5db371",
      tags: ["risotto", "mushroom", "comfort-food"]
    },
    {
      id: 8,
      title: "Matcha Chia Pudding",
      category: "Breakfast",
      prepTime: "5 min",
      cookTime: "0 min",
      difficulty: "Easy",
      excerpt: "Energizing breakfast pudding combining the antioxidant power of matcha with omega-rich chia seeds.",
      image: "photo-1495214783159-3503fd1b572d",
      tags: ["matcha", "chia", "pudding"]
    },
    {
      id: 9,
      title: "Fermented Hot Sauce",
      category: "Snacks",
      prepTime: "20 min",
      cookTime: "0 min",
      difficulty: "Hard",
      excerpt: "Tangy, spicy, and full of gut-friendly probiotics. This fermented hot sauce gets better with age.",
      image: "photo-1589632883080-2482667ceb9e",
      tags: ["fermented", "hot-sauce", "chili"]
    },
    {
      id: 10,
      title: "Ginger Kombucha Mojito",
      category: "Drinks",
      prepTime: "5 min",
      cookTime: "0 min",
      difficulty: "Easy",
      excerpt: "A refreshing non-alcoholic spin on the classic mojito using homemade ginger kombucha.",
      image: "photo-1536935338788-846bb9981813",
      tags: ["kombucha", "drinks", "mocktail"]
    },
    {
      id: 11,
      title: "Cashew Cheese Stuffed Peppers",
      category: "Lunch",
      prepTime: "15 min",
      cookTime: "25 min",
      difficulty: "Medium",
      excerpt: "Bell peppers filled with savory cashew cheese and herbs, baked to perfection.",
      image: "photo-1625944525533-363023948818",
      tags: ["cashew", "cheese", "peppers"]
    },
    {
      id: 12,
      title: "Miso Roasted Vegetables",
      category: "Dinner",
      prepTime: "10 min",
      cookTime: "30 min",
      difficulty: "Easy",
      excerpt: "Seasonal vegetables elevated with the unique umami flavor of fermented miso paste.",
      image: "photo-1567620832903-9fc6debc209f",
      tags: ["miso", "roasted", "vegetables"]
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              #NoFuss Recipes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple, delicious plant-based recipes that anyone can make
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

            {/* Search */}
            <div className="w-full md:w-auto">
              <Input
                placeholder={t("recipe.searchRecipes", language) || "Search recipes..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-64 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 h-full dark:bg-gray-800">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${recipe.image}?w=400&h=300&fit=crop`}
                    alt={recipe.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 flex flex-col h-[calc(100%-33.33%)]">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{recipe.category}</Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{recipe.difficulty}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{recipe.excerpt}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs dark:border-gray-600">
                        Prep: {recipe.prepTime}
                      </Badge>
                      <Badge variant="outline" className="text-xs dark:border-gray-600">
                        Cook: {recipe.cookTime}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t dark:border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs dark:border-gray-600">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <Link to={`/recipes/${recipe.id}`}>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700">
                        {t("recipe.viewRecipe", language) || "View Recipe"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No recipes found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Recipes;
