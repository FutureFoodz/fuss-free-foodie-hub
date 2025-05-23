import { useState, useEffect } from "react";
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
import { markdownToHtml } from "@/lib/utils"; // Import shared utility

// Interface for the form data state
interface RecipeFormData {
  title: string;
  category: string;
  prepTime: string; // Keep as string for form input
  cookTime: string; // Keep as string for form input
  servings: string; // Keep as string for form input
  difficulty: string;
  description: string;
  image: string;
  tags: string; // Comma-separated string
  ingredients: string; // Markdown
  instructions: string; // Markdown
  notes: string; // Markdown
}

// Interface for the actual recipe object (matching recipes.json)
interface Recipe {
  id: number;
  title: string;
  category: string;
  prepTime: string; // In JSON, it's "X min"
  cookTime: string; // In JSON, it's "X min"
  servings: number;
  difficulty: string;
  description: string;
  image: string;
  tags: string[]; // Array of strings
  ingredients: string; // Markdown
  instructions: string; // Markdown
  notes: string; // Markdown
}

const RecipeEditor = () => {
  const { id: recipeIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useTheme();
  const isEditMode = recipeIdParam !== undefined;
  const numericId = isEditMode ? parseInt(recipeIdParam as string) : undefined;

  const initialFormState: RecipeFormData = {
    title: "",
    category: "Dinner",
    prepTime: "",
    cookTime: "",
    servings: "2",
    difficulty: "Easy",
    description: "",
    image: "",
    tags: "",
    ingredients: "# Ingredients\n\n- Ingredient 1\n- Ingredient 2",
    instructions: "# Instructions\n\n1. Step 1\n2. Step 2",
    notes: "# Chef's Notes\n\n- Note 1"
  };

  const [recipeForm, setRecipeForm] = useState<RecipeFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(isEditMode); // Only load if in edit mode
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Effect to fetch recipe data if in edit mode
  useEffect(() => {
    if (isEditMode && numericId !== undefined) {
      setIsLoading(true);
      fetch("/data/recipes.json") // Fetch the list of all recipes
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((recipesData: Recipe[]) => {
          const recipeToEdit = recipesData.find(r => r.id === numericId); // Find the specific recipe to edit
          if (recipeToEdit) {
            // Populate the form with the fetched recipe data
            setRecipeForm({
              title: recipeToEdit.title,
              category: recipeToEdit.category,
              prepTime: recipeToEdit.prepTime.split(" ")[0] || "", // Extract numeric value from "X min"
              cookTime: recipeToEdit.cookTime.split(" ")[0] || "", // Extract numeric value from "X min"
              servings: recipeToEdit.servings.toString(),
              difficulty: recipeToEdit.difficulty,
              description: recipeToEdit.description,
              image: recipeToEdit.image,
              tags: recipeToEdit.tags.join(", "),
              ingredients: recipeToEdit.ingredients,
              instructions: recipeToEdit.instructions,
              notes: recipeToEdit.notes,
            });
          } else {
            setError(`Recipe with ID ${numericId} not found.`);
            toast({ title: "Error", description: `Recipe with ID ${numericId} not found.`, variant: "destructive" });
          }
        })
        .catch(e => {
          console.error("Failed to load recipe for editing:", e);
          setError("Failed to load recipe data.");
          toast({ title: "Error", description: "Could not load recipe data.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEditMode, numericId, toast]);

  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setRecipeForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipeForm.title || !recipeForm.description || !recipeForm.ingredients || !recipeForm.instructions) {
      toast({ title: "Missing required fields", description: "Please fill in Title, Description, Ingredients, and Instructions.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch the current list of recipes to modify it
      const response = await fetch("/data/recipes.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      let recipes: Recipe[] = await response.json();

      // Prepare the recipe data from the form for saving
      const submittedRecipeData: Omit<Recipe, 'id'> = {
        title: recipeForm.title,
        category: recipeForm.category,
        prepTime: `${recipeForm.prepTime || '0'} min`, // Add " min" suffix, default to 0 if empty
        cookTime: `${recipeForm.cookTime || '0'} min`, // Add " min" suffix, default to 0 if empty
        servings: parseInt(recipeForm.servings) || 0, // Default to 0 if parsing fails
        difficulty: recipeForm.difficulty,
        description: recipeForm.description,
        image: recipeForm.image,
        tags: recipeForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag), // Convert comma-separated string to array
        ingredients: recipeForm.ingredients,
        instructions: recipeForm.instructions,
        notes: recipeForm.notes,
      };

      let newRecipeId = numericId; // Used for navigation after submit

      if (isEditMode && numericId !== undefined) {
        // Update existing recipe
        recipes = recipes.map(r => r.id === numericId ? { ...submittedRecipeData, id: numericId } : r);
      } else {
        // Create new recipe: Generate a new ID (max ID + 1)
        newRecipeId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
        const newFullRecipe: Recipe = { ...submittedRecipeData, id: newRecipeId };
        recipes.push(newFullRecipe);
      }

      // Simulate saving by logging the updated JSON to the console
      const updatedJson = JSON.stringify(recipes, null, 2);
      console.log("Updated recipes.json content (simulated save):\n", updatedJson);

      toast({
        title: isEditMode ? "Recipe Updated (Simulated)" : "Recipe Created (Simulated)",
        description: `${recipeForm.title} processed. JSON in console. Copy to public/data/recipes.json to persist.`,
        duration: 9000, 
      });
      
      // Navigate to the recipe's detail page (either existing or new)
      navigate(isEditMode && numericId ? `/recipes/${numericId}` : `/recipes/${newRecipeId}`);

    } catch (err) {
      console.error("Error during recipe submission:", err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      toast({ title: "Submission Error", description: `Could not process recipe: ${message}. Check console.`, variant: "destructive" });
    } finally {
      setIsLoading(false); // Ensure loading is stopped on error or success
    }
  };

  if (isLoading && isEditMode) { // Only show main loading for edit mode initial fetch
    return <div className="container mx-auto px-4 py-12 text-center">Loading recipe editor...</div>;
  }
  if (error) {
     return <div className="container mx-auto px-4 py-12 text-center text-red-500">Error: {error}</div>;
  }

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
                  disabled={isLoading}
                >
                  {previewMode ? "Edit" : "Preview"}
                </Button>
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? (isEditMode ? "Saving..." : "Creating...") : t("action.submit", language)}
                </Button>
              </div>
            </div>
            
            {previewMode ? (
              <div className="space-y-8">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <h2 className="text-xl font-bold mb-2 dark:text-white">{recipeForm.title || "Recipe Title"}</h2>
                  <p className="dark:text-gray-300">{recipeForm.description || "Recipe description"}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Category</span><span className="dark:text-white">{recipeForm.category}</span></div>
                    <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Prep Time</span><span className="dark:text-white">{recipeForm.prepTime} min</span></div>
                    <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Cook Time</span><span className="dark:text-white">{recipeForm.cookTime} min</span></div>
                    <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Servings</span><span className="dark:text-white">{recipeForm.servings}</span></div>
                  </div>
                </div>
                
                <Tabs defaultValue="ingredients">
                  <TabsList>
                    <TabsTrigger value="ingredients">{t("recipe.ingredients", language)}</TabsTrigger>
                    <TabsTrigger value="instructions">{t("recipe.instructions", language)}</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ingredients" className="mt-4"><div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(recipeForm.ingredients) }} /></TabsContent>
                  <TabsContent value="instructions" className="mt-4"><div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(recipeForm.instructions) }} /></TabsContent>
                  <TabsContent value="notes" className="mt-4"><div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(recipeForm.notes) }} /></TabsContent>
                </Tabs>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Title <span className="text-red-500">*</span></Label>
                    <Input id="title" value={recipeForm.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Enter recipe title" className="dark:bg-gray-700" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={recipeForm.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="dark:bg-gray-700"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Dinner">Dinner</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                        <SelectItem value="Snacks">Snacks</SelectItem>
                         <SelectItem value="Drinks">Drinks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea id="description" value={recipeForm.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Brief description of the recipe" className="resize-none dark:bg-gray-700" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" value={recipeForm.tags} onChange={(e) => handleInputChange("tags", e.target.value)} placeholder="tempeh, quick, vegan" className="dark:bg-gray-700" />
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="space-y-2"><Label htmlFor="prepTime">Prep Time (minutes)</Label><Input id="prepTime" type="number" value={recipeForm.prepTime} onChange={(e) => handleInputChange("prepTime", e.target.value)} placeholder="15" className="dark:bg-gray-700" /></div>
                  <div className="space-y-2"><Label htmlFor="cookTime">Cook Time (minutes)</Label><Input id="cookTime" type="number" value={recipeForm.cookTime} onChange={(e) => handleInputChange("cookTime", e.target.value)} placeholder="30" className="dark:bg-gray-700" /></div>
                  <div className="space-y-2"><Label htmlFor="servings">Servings</Label><Input id="servings" type="number" value={recipeForm.servings} onChange={(e) => handleInputChange("servings", e.target.value)} placeholder="4" className="dark:bg-gray-700" /></div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={recipeForm.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                      <SelectTrigger className="dark:bg-gray-700"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image Filename (from Unsplash, e.g., photo-xxxxxxxx)</Label>
                  <Input id="image" value={recipeForm.image} onChange={(e) => handleInputChange("image", e.target.value)} placeholder="photo-1618160702438-9b02ab6515c9" className="dark:bg-gray-700" />
                </div>
                
                <Tabs defaultValue="ingredients">
                  <TabsList>
                    <TabsTrigger value="ingredients">{t("recipe.ingredients", language)} <span className="text-red-500 ml-1">*</span></TabsTrigger>
                    <TabsTrigger value="instructions">{t("recipe.instructions", language)} <span className="text-red-500 ml-1">*</span></TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ingredients" className="mt-4">
                    <div className="space-y-2"><Label htmlFor="ingredients" className="sr-only">Ingredients (Markdown)</Label><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Use Markdown. Example: "- 2 cups flour"</div><Textarea id="ingredients" value={recipeForm.ingredients} onChange={(e) => handleInputChange("ingredients", e.target.value)} className="min-h-[300px] font-mono dark:bg-gray-700" required /></div>
                  </TabsContent>
                  <TabsContent value="instructions" className="mt-4">
                    <div className="space-y-2"><Label htmlFor="instructions" className="sr-only">Instructions (Markdown)</Label><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Use Markdown. Example: "1. Preheat oven"</div><Textarea id="instructions" value={recipeForm.instructions} onChange={(e) => handleInputChange("instructions", e.target.value)} className="min-h-[300px] font-mono dark:bg-gray-700" required /></div>
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <div className="space-y-2"><Label htmlFor="notes" className="sr-only">Notes (Markdown)</Label><div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Additional tips or variations.</div><Textarea id="notes" value={recipeForm.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="min-h-[300px] font-mono dark:bg-gray-700" /></div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate(isEditMode && numericId ? `/recipes/${numericId}` : '/recipes')} className="dark:border-gray-600 dark:text-gray-300" disabled={isLoading}>{t("action.cancel", language)}</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" disabled={isLoading}>{isLoading ? (isEditMode ? "Saving..." : "Creating...") : t("action.submit", language)}</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeEditor;
