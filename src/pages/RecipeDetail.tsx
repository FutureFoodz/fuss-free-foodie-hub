
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, this would fetch from an API or database
  const recipes = [
    {
      id: 1,
      title: "5-Minute Tempeh Stir Fry",
      category: "Dinner",
      prepTime: "5 min",
      cookTime: "10 min",
      servings: 2,
      difficulty: "Easy",
      excerpt: "Quick and delicious plant-based protein that doesn't compromise on flavor. Perfect for busy weeknights.",
      description: "This super quick tempeh stir fry is perfect for those evenings when you need something nutritious but don't have a lot of time. The tempeh soaks up the savory sauce beautifully, and you can use whatever vegetables you have on hand.",
      image: "photo-1618160702438-9b02ab6515c9",
      ingredients: [
        "8 oz tempeh, cubed",
        "2 tbsp tamari or soy sauce",
        "1 tbsp maple syrup",
        "1 tbsp sesame oil",
        "2 cloves garlic, minced",
        "1 inch ginger, grated",
        "1 bell pepper, sliced",
        "2 cups mixed vegetables (broccoli, carrots, snap peas)",
        "2 green onions, sliced",
        "1 tbsp sesame seeds"
      ],
      instructions: [
        "Prepare the sauce by mixing tamari/soy sauce, maple syrup, and half the sesame oil.",
        "Heat remaining sesame oil in a large skillet over medium-high heat.",
        "Add tempeh cubes and cook until golden brown on all sides, about 3-4 minutes.",
        "Add garlic and ginger, cook for 30 seconds until fragrant.",
        "Add vegetables and stir-fry for 3-5 minutes until crisp-tender.",
        "Pour sauce over the stir-fry and toss to coat everything evenly.",
        "Cook for another 1-2 minutes until sauce slightly thickens.",
        "Garnish with green onions and sesame seeds before serving.",
        "Serve hot with brown rice or quinoa (optional)."
      ],
      notes: "Feel free to customize this recipe with whatever vegetables you have on hand. For a gluten-free option, make sure to use tamari instead of soy sauce.",
      tags: ["tempeh", "quick-meals", "protein", "dinner", "stir-fry"]
    },
    {
      id: 2,
      title: "Chocolate Avocado Mousse",
      category: "Dessert",
      prepTime: "10 min",
      cookTime: "0 min",
      servings: 4,
      difficulty: "Easy",
      excerpt: "Rich, creamy, and surprisingly healthy dessert that will fool even the most skeptical sweet tooth.",
      description: "This decadent chocolate mousse is made with ripe avocados for a creamy texture without any dairy. It's rich in healthy fats and antioxidants, making it a guilt-free treat that's ready in minutes.",
      image: "photo-1582562124811-c09040d0a901",
      ingredients: [
        "2 ripe avocados, pitted and peeled",
        "1/3 cup cocoa powder",
        "1/4 cup maple syrup (adjust to taste)",
        "1/4 cup plant-based milk",
        "1 tsp vanilla extract",
        "Pinch of salt",
        "Fresh berries for garnish (optional)",
        "Mint leaves for garnish (optional)"
      ],
      instructions: [
        "Add the avocados, cocoa powder, maple syrup, plant milk, vanilla, and salt to a food processor.",
        "Process until completely smooth, stopping to scrape down the sides as needed.",
        "Taste and adjust sweetness if necessary by adding more maple syrup.",
        "Spoon the mousse into serving glasses or bowls.",
        "Refrigerate for at least 30 minutes to firm up (although it can be eaten immediately).",
        "Before serving, garnish with fresh berries and mint leaves if desired."
      ],
      notes: "For best results, make sure your avocados are perfectly ripe. The mousse will keep in the refrigerator for up to 2 days, but it's best enjoyed fresh as the avocado may start to oxidize.",
      tags: ["dessert", "chocolate", "healthy", "avocado", "no-bake"]
    },
    {
      id: 3,
      title: "Vegan Cheese Platter",
      category: "Snacks",
      prepTime: "15 min",
      cookTime: "0 min",
      servings: 6,
      difficulty: "Medium",
      excerpt: "Impress your guests with this elegant spread of homemade plant-based cheeses and accompaniments.",
      description: "Create a stunning vegan cheese board that rivals any traditional dairy platter. This guide will help you assemble a beautiful arrangement that's perfect for entertaining or special occasions.",
      image: "photo-1550507992-eb63ffee0847",
      ingredients: [
        "1 wheel of store-bought or homemade cashew brie",
        "1 block of herb-crusted almond feta",
        "1 container of garlic herb spread",
        "Assorted crackers and bread",
        "Fresh and dried fruits (grapes, figs, apricots)",
        "Mixed nuts (walnuts, almonds)",
        "Olives and pickles",
        "Fresh herbs for garnish",
        "Fig jam or other preserves"
      ],
      instructions: [
        "Select a serving board or platter that's large enough to hold all elements.",
        "Place the cheeses on the board first, leaving space between them.",
        "Fill small bowls with olives, pickles, and jam, and place them on the board.",
        "Arrange crackers and bread slices around the cheeses.",
        "Fill remaining spaces with fresh fruits, dried fruits, and nuts.",
        "Tuck sprigs of fresh herbs around the board for color and aroma.",
        "Serve at room temperature for the best flavor and texture."
      ],
      notes: "For a completely homemade platter, try making your own cashew cheese by blending soaked cashews with nutritional yeast, lemon juice, and herbs. Allow it to culture for 24-48 hours for that authentic tangy flavor.",
      tags: ["cheese", "entertaining", "plant-based", "appetizer", "party"]
    },
    {
      id: 4,
      title: "Kimchi Breakfast Bowl",
      category: "Breakfast",
      prepTime: "5 min",
      cookTime: "5 min",
      servings: 1,
      difficulty: "Easy",
      excerpt: "Start your day with a probiotic-rich bowl that combines the tangy kick of kimchi with protein-packed tofu.",
      description: "This savory breakfast bowl brings together Korean-inspired flavors with plant-based protein for an energizing start to your day. The combination of warm rice, crispy tofu, and tangy kimchi creates a perfectly balanced meal.",
      image: "photo-1547592180-85f173990888",
      ingredients: [
        "1/2 cup cooked brown rice or quinoa",
        "4 oz extra-firm tofu, cubed",
        "1/4 cup kimchi",
        "1/2 avocado, sliced",
        "1 tsp sesame oil",
        "1 tsp tamari or soy sauce",
        "1/2 tsp gochugaru (Korean chili flakes) or regular chili flakes",
        "1 green onion, sliced",
        "1 tsp toasted sesame seeds"
      ],
      instructions: [
        "Heat a small non-stick pan over medium-high heat and add the sesame oil.",
        "Add the tofu cubes and cook until golden brown on all sides, about 3-5 minutes.",
        "Splash with tamari or soy sauce in the last 30 seconds of cooking.",
        "Warm the rice or quinoa if it's not freshly made.",
        "Assemble the bowl by placing the warm grain at the bottom.",
        "Arrange the tofu, kimchi, and avocado slices on top.",
        "Sprinkle with chili flakes, green onions, and sesame seeds.",
        "Serve immediately, mixing everything together before eating."
      ],
      notes: "You can make this bowl more substantial by adding more vegetables like sautéed spinach or mushrooms. For an extra kick, drizzle with gochujang (Korean chili paste) mixed with a little maple syrup.",
      tags: ["kimchi", "breakfast", "bowl", "tofu", "savory"]
    },
    {
      id: 5,
      title: "Kombucha Smoothie Bowl",
      category: "Breakfast",
      prepTime: "10 min",
      cookTime: "0 min",
      servings: 1,
      difficulty: "Easy",
      excerpt: "A refreshing smoothie bowl featuring the subtle tang of homemade kombucha and seasonal fruits.",
      description: "This vibrant smoothie bowl combines the probiotic benefits of kombucha with nutrient-dense fruits and toppings. It's a refreshing and nourishing way to start your day with both prebiotics and probiotics for optimal gut health.",
      image: "photo-1577805947697-89e18249d767",
      ingredients: [
        "1/2 cup plain kombucha (not flavored)",
        "1 frozen banana",
        "1/2 cup frozen mixed berries",
        "1 tbsp chia seeds",
        "Optional: 1 scoop plant-based protein powder",
        "Toppings: fresh fruit, granola, coconut flakes, hemp seeds"
      ],
      instructions: [
        "Add kombucha, frozen banana, mixed berries, and chia seeds to a blender.",
        "Blend until smooth but still thick enough to eat with a spoon.",
        "If adding protein powder, blend it in now with a splash more kombucha if needed.",
        "Pour into a bowl.",
        "Arrange toppings in an aesthetically pleasing way on top of the smoothie.",
        "Enjoy immediately before it melts!"
      ],
      notes: "For the best results, use kombucha that is not too sour. If your kombucha is very tangy, you may want to add a teaspoon of maple syrup or a date to sweeten the bowl slightly. The frozen banana provides creaminess, but you can substitute with 1/4 avocado for a lower-sugar option.",
      tags: ["kombucha", "smoothie", "breakfast", "probiotic", "fruit"]
    },
    {
      id: 6,
      title: "Tempeh Reuben Sandwich",
      category: "Lunch",
      prepTime: "10 min",
      cookTime: "8 min",
      servings: 2,
      difficulty: "Medium",
      excerpt: "A plant-based spin on the classic sandwich with marinated tempeh, sauerkraut and homemade dressing.",
      description: "This vegan take on the classic Reuben sandwich uses marinated tempeh instead of corned beef, creating a satisfyingly savory lunch option. The combination of tangy sauerkraut, creamy Russian dressing, and hearty rye bread makes this a memorable sandwich.",
      image: "photo-1603046891744-76e6481cf539",
      ingredients: [
        "8 oz tempeh, sliced into thin rectangles",
        "2 tbsp tamari or soy sauce",
        "1 tsp liquid smoke",
        "1 tsp maple syrup",
        "1 tsp paprika",
        "4 slices rye bread",
        "1/2 cup sauerkraut, drained",
        "2 slices vegan cheese (optional)",
        "1 tbsp vegan butter",
        "For the Russian dressing:",
        "2 tbsp vegan mayo",
        "1 tbsp ketchup",
        "1 tsp horseradish",
        "1/2 tsp vegan Worcestershire sauce",
        "1 tsp pickle relish"
      ],
      instructions: [
        "Mix tamari/soy sauce, liquid smoke, maple syrup, and paprika in a shallow dish.",
        "Marinate the tempeh slices for at least 5 minutes (longer if you have time).",
        "Meanwhile, mix all Russian dressing ingredients in a small bowl.",
        "Heat a skillet over medium heat and cook the marinated tempeh for 2-3 minutes per side until browned.",
        "In the same skillet, melt half the vegan butter and place two slices of rye bread.",
        "Spread Russian dressing on both slices, then layer tempeh, sauerkraut, and vegan cheese on one slice.",
        "Close the sandwich with the other slice and cook for 2-3 minutes until golden.",
        "Flip carefully, adding remaining butter to the pan, and cook the other side until golden and crispy.",
        "Repeat for the second sandwich.",
        "Slice diagonally and serve warm."
      ],
      notes: "For best results, make sure to press your tempeh before marinating to help it absorb more flavor. If you don't have liquid smoke, you can substitute with 1/2 tsp of smoked paprika for a similar effect.",
      tags: ["tempeh", "sandwich", "lunch", "reuben", "sauerkraut"]
    }
  ];

  const recipe = recipes.find(r => r.id === Number(id));

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Recipe not found</h2>
        <p className="mt-4">The recipe you're looking for doesn't exist.</p>
        <Button className="mt-6" asChild>
          <Link to="/recipes">Back to Recipes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header with Image */}
      <div className="w-full h-[40vh] relative bg-black">
        <img
          src={`https://images.unsplash.com/${recipe.image}?w=1200&h=500&fit=crop`}
          alt={recipe.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="container mx-auto">
            <Link to="/recipes" className="inline-flex items-center text-white/90 hover:text-white mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Recipes
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">{recipe.title}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-green-600 hover:bg-green-700">{recipe.category}</Badge>
              <Badge variant="outline" className="text-white border-white">
                Prep: {recipe.prepTime}
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                Cook: {recipe.cookTime}
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                {recipe.difficulty}
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                Serves: {recipe.servings}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">About This Recipe</h2>
                    <p className="text-gray-700">{recipe.description}</p>
                  </div>

                  <Separator />

                  {/* Ingredients */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-600 mt-2 mr-3"></span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Instructions */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                    <ol className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex">
                          <span className="font-bold text-green-600 min-w-[25px] mr-3">
                            {index + 1}.
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {recipe.notes && (
                    <>
                      <Separator />
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                          <p className="text-gray-700">{recipe.notes}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recipe Details</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Prep Time</TableCell>
                      <TableCell>{recipe.prepTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cook Time</TableCell>
                      <TableCell>{recipe.cookTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Servings</TableCell>
                      <TableCell>{recipe.servings}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Difficulty</TableCell>
                      <TableCell>{recipe.difficulty}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">#{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to action */}
            <Card className="bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Share your creation!</h3>
                <p className="text-gray-700 mb-4">
                  Made this recipe? Tag us on social media with #NoFuss and #FutureFoodz to share your culinary masterpiece!
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  #NoFuss
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
