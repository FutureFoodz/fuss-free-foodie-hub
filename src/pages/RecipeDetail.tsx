import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RecipeSocialShare from "@/components/RecipeSocialShare";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/utils";

interface Recipe {
  id: number;
  title: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  description: string;
  image: string;
  tags: string[];
  ingredients: string;
  instructions: string;
  notes: string;
}

interface Comment {
  id: number;
  name: string;
  date: string;
  content: string;
  avatar: string;
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useTheme();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  // Comments are managed in local state for this example.
  // In a real application, these would likely be fetched from a backend.
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Jamie Wilson",
      date: "May 15, 2025",
      content: "This recipe is amazing! I tried it last night and it was a hit with the whole family. Will definitely make it again.",
      avatar: "W"
    },
    {
      id: 2,
      name: "Alex Chen",
      date: "May 14, 2025",
      content: "I've been looking for a good tempeh recipe for ages. This one is perfect - not too complicated and super flavorful.",
      avatar: "C"
    }
  ]);

  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/recipes.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recipesData: Recipe[] = await response.json();
        const recipeId = parseInt(id as string);
        const foundRecipe = recipesData.find(r => r.id === recipeId);
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          setError("Recipe not found.");
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(`Failed to load recipe: ${e.message}`);
        } else {
          setError("Failed to load recipe: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const extractIngredients = (markdown: string): string[] => {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    return lines
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
  };
  
  const ingredientList = recipe ? extractIngredients(recipe.ingredients) : [];

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const shareUrl = window.location.href;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim() || !commentEmail.trim()) return;
    
    const newComment: Comment = {
      id: comments.length + 1,
      name: commentName,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: commentText,
      avatar: commentName.charAt(0).toUpperCase()
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
    setCommentName("");
    setCommentEmail("");
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading recipe...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  }

  if (!recipe) {
    return <div className="container mx-auto px-4 py-12 text-center">Recipe not found.</div>;
  }

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
                
                <Tabs defaultValue="ingredients" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="ingredients">{t("recipe.ingredients", language)}</TabsTrigger>
                    <TabsTrigger value="instructions">{t("recipe.instructions", language)}</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ingredients" className="mt-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <h1 className="text-2xl font-bold mt-4 mb-2">Ingredients</h1>
                      {recipe.ingredients.trim() === "" ? (
                        <p>No ingredients listed.</p>
                      ) : (
                        <>
                          <div className="space-y-2">
                            {ingredientList.map((ingredient, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`ingredient-${idx}`} 
                                  checked={checkedIngredients.includes(ingredient)}
                                  onCheckedChange={() => toggleIngredient(ingredient)}
                                />
                                <label 
                                  htmlFor={`ingredient-${idx}`}
                                  className={`text-lg ${checkedIngredients.includes(ingredient) ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                  {ingredient}
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Check items as you gather them
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructions" className="mt-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {recipe.instructions.trim() === "" ? <p>No instructions provided.</p> : <div dangerouslySetInnerHTML={{ __html: markdownToHtml(recipe.instructions) }} />}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                     {recipe.notes.trim() === "" ? <p>No notes available.</p> : <div dangerouslySetInnerHTML={{ __html: markdownToHtml(recipe.notes) }} />}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 pt-6 border-t dark:border-gray-700 flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm dark:border-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t("action.share", language)}</h3>
                  <RecipeSocialShare
                    title={recipe.title} 
                    description={recipe.description}
                    url={shareUrl}
                  />
                </div>
                
                <div className="mt-8 pt-6 border-t dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">{t("blog.comments", language)} ({comments.length})</h3>
                  
                  <Card className="mb-8 border-0 shadow-sm dark:bg-gray-700">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{t("blog.writeComment", language)}</h4>
                      <form onSubmit={handleSubmitComment} className="space-y-4">
                        <Textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Your comment"
                          className="resize-none dark:bg-gray-800 dark:border-gray-600"
                          required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={commentName}
                            onChange={(e) => setCommentName(e.target.value)}
                            placeholder="Name"
                            className="dark:bg-gray-800 dark:border-gray-600"
                            required
                          />
                          <Input
                            value={commentEmail}
                            onChange={(e) => setCommentEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            className="dark:bg-gray-800 dark:border-gray-600"
                            required
                          />
                        </div>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                          {t("action.submit", language)}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4 p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                        <Avatar>
                          <AvatarFallback>{comment.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold dark:text-white">{comment.name}</h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</span>
                          </div>
                          <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-end">
              <Link to={`/recipes/${id}/edit`}>
                <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  {t("recipe.editRecipe", language)}
                </Button>
              </Link>
            </div>
          </div>
          
          <div>
            <div className="sticky top-20 space-y-6">
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
              
              <Card className="border-0 shadow-md dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Related Recipes</h3>
                  {/* TODO: Fetch and display actual related recipes */}
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
                    {/* Add more related recipes here */}
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

export default RecipeDetail;
