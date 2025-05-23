import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

interface Recipe {
  id: number;
  title: string;
  category: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  description: string; // recipes.json provides 'description' directly
  image: string;
  tags: string[];
  // Note: ingredients, instructions, notes are not included for the recipe listing page
}

const Recipes = () => {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { language } = useTheme();

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks", "Drinks"];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/recipes.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Recipe[] = await response.json();
        // recipes.json uses 'description' field, which matches the Recipe interface.
        // If 'excerpt' were used in JSON, a mapping step would be needed here.
        setAllRecipes(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(`Failed to load recipes: ${e.message}`);
        } else {
          setError("Failed to load recipes: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from excerpt to description
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading recipes...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  }

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
                <CardContent className="p-4 flex flex-col h-[calc(100%-150px)]">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{recipe.category}</Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{recipe.difficulty}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {recipe.title}
                    </h3>
                    {/* Ensure your Recipe interface and data use 'description' if that's what recipes.json provides */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{recipe.description}</p>
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

          {filteredRecipes.length === 0 && !loading && (
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
