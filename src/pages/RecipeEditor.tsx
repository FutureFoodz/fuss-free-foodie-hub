
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

const RecipeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useTheme();
  const isEditMode = id !== undefined;
  
  // Initial state based on whether we're editing or creating
  const [recipe, setRecipe] = useState(
    isEditMode ? {
      id,
      title: "5-Minute Tempeh Stir Fry",
      category: "Dinner",
      prepTime: "5",
      cookTime: "10",
      servings: "2",
      difficulty: "Easy",
      description: "Quick and delicious plant-based protein that doesn't compromise on flavor. Perfect for busy weeknights.",
      image: "photo-1618160702438-9b02ab6515c9",
      tags: "tempeh, quick-meals, protein",
      ingredients: `# Ingredients

- 200g tempeh, cubed
- 2 tbsp soy sauce or tamari
- 1 tbsp maple syrup
- 1 clove garlic, minced
- 2 cups mixed vegetables (bell peppers, broccoli, snap peas work well)
- 1 tbsp cooking oil
- Optional garnishes:
  - 1 tsp sriracha
  - 1 tbsp sesame seeds
  - 2 green onions, sliced`,
      instructions: `# Instructions

1. **Prepare the sauce**: In a small bowl, whisk together soy sauce, maple syrup, and minced garlic.

2. **Cut and prepare**: Cube the tempeh into bite-sized pieces. Chop vegetables into similar-sized pieces for even cooking.

3. **Heat the pan**: Heat oil in a wok or large skillet over medium-high heat.

4. **Cook tempeh**: Add tempeh to the hot oil and cook for 3-4 minutes, tossing occasionally until lightly browned on multiple sides.

5. **Add vegetables**: Add your chosen vegetables to the pan and stir-fry for 2-3 minutes until beginning to soften but still crisp.

6. **Add sauce**: Pour the sauce over the tempeh and vegetables, stirring quickly to coat. Cook for another 1-2 minutes until the sauce thickens slightly.

7. **Serve**: Transfer to bowls and top with optional garnishes if desired.

> **Pro tip**: For extra flavor, marinate the tempeh in the sauce for 15 minutes before cooking if you have time.`,
      notes: `# Chef's Notes

This recipe is incredibly versatile:

- **Protein swap**: No tempeh? Try using tofu, seitan, or chickpeas instead.
- **Vegetable options**: Use whatever vegetables you have on hand - carrots, snow peas, mushrooms, and bok choy all work great.
- **Sauce variations**: Add 1 tsp of grated ginger or a splash of rice vinegar to change up the flavor profile.
- **Serving suggestions**: Serve with brown rice, quinoa, or rice noodles for a complete meal.

*Remember, the #NoFuss philosophy is about working with what you have!*`
    } : {
      title: "",
      category: "Dinner",
      prepTime: "",
      cookTime: "",
      servings: "",
      difficulty: "Easy",
      description: "",
      image: "",
      tags: "",
      ingredients: "# Ingredients\n\n- ",
      instructions: "# Instructions\n\n1. ",
      notes: "# Chef's Notes\n\n"
    }
  );

  const [previewMode, setPreviewMode] = useState(false);
  
  const handleInputChange = (field: string, value: string) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!recipe.title || !recipe.description || !recipe.ingredients || !recipe.instructions) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, here we would save to a backend
    toast({
      title: isEditMode ? "Recipe updated!" : "Recipe created!",
      description: `${recipe.title} has been ${isEditMode ? "updated" : "created"} successfully.`
    });
    
    // Navigate to the recipe detail page
    navigate(isEditMode ? `/recipes/${id}` : "/recipes");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg dark:bg-gray-800">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? t("recipe.editRecipe", language) : t("recipe.createRecipe", language)}
              </h1>
              <div>
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="mr-2 dark:border-gray-600 dark:text-gray-300"
                >
                  {previewMode ? "Edit" : "Preview"}
                </Button>
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  {t("action.submit", language)}
                </Button>
              </div>
            </div>
            
            {previewMode ? (
              <div className="space-y-8">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <h2 className="text-xl font-bold mb-2 dark:text-white">{recipe.title || "Recipe Title"}</h2>
                  <p className="dark:text-gray-300">{recipe.description || "Recipe description"}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Category</span>
                      <span className="dark:text-white">{recipe.category}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Prep Time</span>
                      <span className="dark:text-white">{recipe.prepTime} min</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Cook Time</span>
                      <span className="dark:text-white">{recipe.cookTime} min</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Servings</span>
                      <span className="dark:text-white">{recipe.servings}</span>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="ingredients">
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
              </div>
            ) : (
              <form className="space-y-8">
                {/* Basic Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      value={recipe.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter recipe title"
                      className="dark:bg-gray-700"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={recipe.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="dark:bg-gray-700">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Dinner">Dinner</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                        <SelectItem value="Snacks">Snacks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      value={recipe.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Brief description of the recipe"
                      className="resize-none dark:bg-gray-700"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={recipe.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      placeholder="tempeh, quick, vegan"
                      className="dark:bg-gray-700"
                    />
                  </div>
                </div>
                
                {/* Cooking Details */}
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={recipe.prepTime}
                      onChange={(e) => handleInputChange("prepTime", e.target.value)}
                      placeholder="15"
                      className="dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      value={recipe.cookTime}
                      onChange={(e) => handleInputChange("cookTime", e.target.value)}
                      placeholder="30"
                      className="dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      value={recipe.servings}
                      onChange={(e) => handleInputChange("servings", e.target.value)}
                      placeholder="4"
                      className="dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={recipe.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger className="dark:bg-gray-700">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={recipe.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="Enter image URL or unsplash ID"
                    className="dark:bg-gray-700"
                  />
                </div>
                
                {/* Markdown Editor Tabs */}
                <Tabs defaultValue="ingredients">
                  <TabsList>
                    <TabsTrigger value="ingredients">{t("recipe.ingredients", language)}</TabsTrigger>
                    <TabsTrigger value="instructions">{t("recipe.instructions", language)}</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ingredients" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="ingredients">
                        Ingredients (Markdown) <span className="text-red-500">*</span>
                      </Label>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Use Markdown for formatting. Example: "- 2 cups flour"
                      </div>
                      <Textarea
                        id="ingredients"
                        value={recipe.ingredients}
                        onChange={(e) => handleInputChange("ingredients", e.target.value)}
                        className="min-h-[300px] font-mono dark:bg-gray-700"
                        required
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructions" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="instructions">
                        Instructions (Markdown) <span className="text-red-500">*</span>
                      </Label>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Use Markdown for formatting. Example: "1. Preheat oven to 350°F"
                      </div>
                      <Textarea
                        id="instructions"
                        value={recipe.instructions}
                        onChange={(e) => handleInputChange("instructions", e.target.value)}
                        className="min-h-[300px] font-mono dark:bg-gray-700"
                        required
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Markdown)</Label>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Use Markdown for formatting. Add any additional tips or variations.
                      </div>
                      <Textarea
                        id="notes"
                        value={recipe.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="min-h-[300px] font-mono dark:bg-gray-700"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/recipes${id ? `/${id}` : ''}`)}
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    {t("action.cancel", language)}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    {t("action.submit", language)}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple markdown to HTML conversion (same as in RecipeDetail.tsx)
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

export default RecipeEditor;
