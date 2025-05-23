
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Facebook, Twitter, Instagram, Star, Share2, ShoppingCart } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { language } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Mock product data
  const product = {
    id: id,
    name: "Artisanal Tempeh",
    category: "Protein",
    price: "$12.99",
    description: "Handcrafted fermented soybean goodness with traditional Indonesian methods",
    longDescription: `
      <p>Our artisanal tempeh is lovingly crafted using traditional Indonesian techniques that have been perfected over generations.</p>
      
      <p>Starting with the finest organic soybeans, we soak, dehull, and partially cook them before introducing the <em>Rhizopus oligosporus</em> culture. Then comes the magic - a 48-hour fermentation period where the soybeans transform into a delicious cake-like structure, bound together by the culture's white mycelium.</p>
      
      <h3>Nutrition Profile</h3>
      <ul>
        <li>19g of complete protein per 100g serving</li>
        <li>Rich in prebiotics and probiotics</li>
        <li>Excellent source of B vitamins, especially B12</li>
        <li>High in manganese, copper, and phosphorus</li>
        <li>Contains all essential amino acids</li>
      </ul>
      
      <h3>Storage Instructions</h3>
      <p>Keep refrigerated at all times. For best flavor and texture, consume within 7 days of delivery. Can be frozen for up to 3 months.</p>
      
      <h3>Serving Suggestions</h3>
      <p>Slice and marinate before pan-frying, crumble into stir-fries, or cube and add to curries and stews. Check out our recipe section for more inspiration!</p>
      
      <h3>Ethical Standards</h3>
      <p>All soybeans are certified organic and non-GMO. Our production facilities use 100% renewable energy, and our packaging is fully compostable.</p>
    `,
    image: "photo-1618160702438-9b02ab6515c9",
    secondaryImages: [
      "photo-1618160702438-9b02ab6515c9",
      "photo-1618160702438-9b02ab6515c9",
      "photo-1618160702438-9b02ab6515c9"
    ],
    inStock: true,
    rating: 4.8,
    reviews: [
      {
        id: 1,
        name: "Jamie Wilson",
        rating: 5,
        date: "March 15, 2024",
        content: "Best tempeh I've ever tried! The texture is perfect and it has that genuine fermented flavor that many commercial brands lack.",
        avatar: "W"
      },
      {
        id: 2,
        name: "Alex Chen",
        rating: 4,
        date: "March 10, 2024",
        content: "Very good quality and flavor. I only wish it came in a larger size option for when I'm meal prepping for the week.",
        avatar: "C"
      }
    ]
  };

  const handleAddToCart = () => {
    toast({
      title: `Added to cart: ${product.name}`,
      description: `Quantity: ${quantity} - Total: $${(parseFloat(product.price.substring(1)) * quantity).toFixed(2)}`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim() || !name.trim() || !email.trim() || rating === 0) return;
    
    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. Your review will be visible after moderation.",
    });
    
    setReview("");
    setName("");
    setEmail("");
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm flex space-x-2">
          <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <Link to="/marketplace" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Marketplace</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <img
                src={`https://images.unsplash.com/${product.image}?w=800&h=600&fit=crop`}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.secondaryImages.map((img, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${img}?w=200&h=150&fit=crop`}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            
            <div className="flex items-center space-x-2 my-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300">{product.rating} ({product.reviews.length} reviews)</span>
            </div>
            
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 my-4">
              {product.price}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>
            
            {/* Add to Cart */}
            <div className="my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("product.quantity", language)}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="dark:bg-gray-700"
                  />
                </div>
                <div className={`text-sm ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {product.inStock ? t("product.inStock", language) : t("product.outOfStock", language)}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleAddToCart} 
                  disabled={!product.inStock}
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t("action.addToCart", language)}
                </Button>
                
                <Button variant="outline" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Facebook className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Twitter className="h-4 w-4 mr-2" />
                  Tweet
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Instagram className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Description */}
        <div className="mt-12">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Product Details</h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Reviews */}
        <div className="mt-12">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {t("product.reviews", language)} ({product.reviews.length})
              </h2>
              
              {/* Reviews list */}
              <div className="space-y-6 mb-8">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex my-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Review form */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Write a Review</h3>
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("product.rating", language)}
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${
                            star <= (hoverRating || rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300 dark:text-gray-500'
                          }`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Your review"
                    className="resize-none dark:bg-gray-700"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="dark:bg-gray-700"
                      required
                    />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                      className="dark:bg-gray-700"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    {t("action.submit", language)}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
