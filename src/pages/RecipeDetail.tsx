
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RecipeSocialShare from "@/components/RecipeSocialShare";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

const RecipeDetail = () => {
  const { id } = useParams();
  const { language } = useTheme();

  // Mock recipe data with markdown content
  const recipe = {
    id: id,
    title: "5-Minute Tempeh Stir Fry",
    category: "Dinner",
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 2,
    difficulty: "Easy",
    description: "Quick and delicious plant-based protein that doesn't compromise on flavor. Perfect for busy weeknights.",
    image: "photo-1618160702438-9b02ab6515c9",
    tags: ["tempeh", "quick-meals", "protein"],
    ingredients: `
# Ingredients

- 200g tempeh, cubed
- 2 tbsp soy sauce or tamari
- 1 tbsp maple syrup
- 1 clove garlic, minced
- 2 cups mixed vegetables (bell peppers, broccoli, snap peas work well)
- 1 tbsp cooking oil
- Optional garnishes:
  - 1 tsp sriracha
  - 1 tbsp sesame seeds
  - 2 green onions, sliced
    `,
    instructions: `
# Instructions

1. **Prepare the sauce**: In a small bowl, whisk together soy sauce, maple syrup, and minced garlic.

2. **Cut and prepare**: Cube the tempeh into bite-sized pieces. Chop vegetables into similar-sized pieces for even cooking.

3. **Heat the pan**: Heat oil in a wok or large skillet over medium-high heat.

4. **Cook tempeh**: Add tempeh to the hot oil and cook for 3-4 minutes, tossing occasionally until lightly browned on multiple sides.

5. **Add vegetables**: Add your chosen vegetables to the pan and stir-fry for 2-3 minutes until beginning to soften but still crisp.

6. **Add sauce**: Pour the sauce over the tempeh and vegetables, stirring quickly to coat. Cook for another 1-2 minutes until the sauce thickens slightly.

7. **Serve**: Transfer to bowls and top with optional garnishes if desired.

> **Pro tip**: For extra flavor, marinate the tempeh in the sauce for 15 minutes before cooking if you have time.

![Tempeh stir fry](https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=400&fit=crop)
    `,
    notes: `
# Chef's Notes

This recipe is incredibly versatile:

- **Protein swap**: No tempeh? Try using tofu, seitan, or chickpeas instead.
- **Vegetable options**: Use whatever vegetables you have on hand - carrots, snow peas, mushrooms, and bok choy all work great.
- **Sauce variations**: Add 1 tsp of grated ginger or a splash of rice vinegar to change up the flavor profile.
- **Serving suggestions**: Serve with brown rice, quinoa, or rice noodles for a complete meal.

*Remember, the #NoFuss philosophy is about working with what you have!*
    `
  };

  // URL for social sharing
  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Image */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src={`https://images.unsplash.com/${recipe.image}?w=1200&h=600&fit=crop`}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-8">
            <Badge className="mb-4">{recipe.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{recipe.title}</h1>
            <div className="flex flex-wrap items-center text-white/80 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <span className="font-medium">{t("recipe.prepTime", language)}:</span>
                <span className="ml-1">{recipe.prepTime}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{t("recipe.cookTime", language)}:</span>
                <span className="ml-1">{recipe.cookTime}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{t("recipe.servings", language)}:</span>
                <span className="ml-1">{recipe.servings}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{t("recipe.difficulty", language)}:</span>
                <span className="ml-1">{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Takes 2/3 on desktop */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md dark:bg-gray-800">
              <CardContent className="p-8">
                {/* Description */}
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{recipe.description}</p>
                
                {/* Tabs for Recipe Sections */}
                <Tabs defaultValue="ingredients" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="ingredients">{t("recipe.ingredients", language)}</TabsTrigger>
                    <TabsTrigger value="instructions">{t("recipe.instructions", language)}</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ingredients" className="mt-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(recipe.ingredients) }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructions" className="mt-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(recipe.instructions) }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(recipe.notes) }} />
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Tags */}
                <div className="mt-8 pt-6 border-t dark:border-gray-700 flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm dark:border-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Edit Recipe Button for Authorized Users */}
            <div className="mt-6 flex justify-end">
              <Link to={`/recipes/${id}/edit`}>
                <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  {t("recipe.editRecipe", language)}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-6">
              {/* Sharing Card */}
              <Card className="border-0 shadow-md dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t("action.share", language)}</h3>
                  <RecipeSocialShare 
                    title={recipe.title}
                    description={recipe.description}
                    url={shareUrl}
                  />
                </CardContent>
              </Card>
              
              {/* Related Recipes Card */}
              <Card className="border-0 shadow-md dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Related Recipes</h3>
                  <div className="space-y-4">
                    <Link to="/recipes/2" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="Chocolate Avocado Mousse"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors dark:text-white">Chocolate Avocado Mousse</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dessert • 10 min</p>
                      </div>
                    </Link>
                    <Link to="/recipes/3" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="Vegan Cheese Platter"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors dark:text-white">Vegan Cheese Platter</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Snacks • 15 min</p>
                      </div>
                    </Link>
                    <Link to="/recipes/6" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1603046891744-76e6481cf539?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="Tempeh Reuben Sandwich"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors dark:text-white">Tempeh Reuben Sandwich</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Lunch • 18 min</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple markdown to HTML conversion
// In a real app, you would use a proper markdown library like marked.js
function markdownToHtml(markdown: string) {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/<\/li>\n<li/gim, '</li><li')
    .replace(/(<li.*<\/li>)/gim, '<ul class="list-disc my-2">$1</ul>')
    // Numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>)/gim, '<ol class="list-decimal my-2">$1</ol>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400">$1</blockquote>')
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="rounded-md my-4 max-w-full h-auto">')
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h1|h2|h3|h4|h5|h6|blockquote|ol|ul|li|img)/.test(m) ? m : '<p class="my-2">' + m + '</p>';
    })
    // Line breaks
    .replace(/\n$/gim, '<br />');
}

export default RecipeDetail;
