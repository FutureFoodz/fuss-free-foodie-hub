
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

const BlogPost = () => {
  const { id } = useParams();
  const { language } = useTheme();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Jamie Wilson",
      date: "March 15, 2024",
      content: "This recipe is amazing! I tried it last night and it was a hit with the whole family. Will definitely make it again.",
      avatar: "W"
    },
    {
      id: 2,
      name: "Alex Chen",
      date: "March 14, 2024",
      content: "I've been looking for a good tempeh recipe for ages. This one is perfect - not too complicated and super flavorful.",
      avatar: "C"
    }
  ]);

  // Mock data for a blog post
  const blogPost = {
    id: id,
    title: "5-Minute Tempeh Stir Fry",
    category: "Recipes",
    readTime: "3 min read",
    author: "Sofia Lindgren",
    date: "March 15, 2024",
    content: `
      <p>Quick and delicious plant-based protein that doesn't compromise on flavor. Perfect for busy weeknights.</p>
      
      <h2>Why Tempeh?</h2>
      <p>Tempeh is not just delicious; it's packed with nutrition. This fermented soybean product provides complete protein, essential amino acids, and beneficial probiotics that support gut health. Unlike many processed meat substitutes, tempeh is minimally processed and free from artificial additives.</p>
      
      <p>Its firm texture makes it excellent for stir-fries, while its nutty flavor complements a wide range of seasonings. Whether you're a seasoned vegan chef or just exploring plant-based options, tempeh deserves a place in your kitchen rotation.</p>
      
      <h2>Key Ingredients</h2>
      <p>The beauty of this stir-fry is its simplicity. You'll need:</p>
      <ul>
        <li>200g tempeh, cubed</li>
        <li>2 tbsp soy sauce or tamari</li>
        <li>1 tbsp maple syrup</li>
        <li>1 clove garlic, minced</li>
        <li>Fresh vegetables of your choice (bell peppers, broccoli, snap peas work well)</li>
        <li>1 tbsp cooking oil</li>
        <li>Optional: sriracha, sesame seeds, green onions for garnish</li>
      </ul>
      
      <h2>The #NoFuss Approach</h2>
      <p>What makes this recipe truly special is its alignment with our #NoFuss philosophy. No complicated techniques, no hard-to-find ingredients, and minimal cleanup. Just honest, wholesome food that nourishes both body and planet.</p>
      
      <p>Try it tonight and tag us in your creations with #NoFuss and #FutureFoodz!</p>
    `,
    image: "photo-1618160702438-9b02ab6515c9",
    tags: ["tempeh", "quick-meals", "protein", "plant-based", "vegan"]
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim() || !email.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      name: name,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: comment,
      avatar: name.charAt(0).toUpperCase()
    };
    
    setComments([newComment, ...comments]);
    setComment("");
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Image */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src={`https://images.unsplash.com/${blogPost.image}?w=1200&h=600&fit=crop`}
          alt={blogPost.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-8">
            <Badge className="mb-4">{blogPost.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{blogPost.title}</h1>
            <div className="flex items-center text-white/80 space-x-4">
              <span>{blogPost.author}</span>
              <span>•</span>
              <span>{blogPost.date}</span>
              <span>•</span>
              <span>{blogPost.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
                
                {/* Tags */}
                <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Share buttons */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-xl font-semibold mb-4">{t("action.share", language)}</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Instagram className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Comments section */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-xl font-semibold mb-6">{t("blog.comments", language)} ({comments.length})</h3>
                  
                  {/* Comment form */}
                  <Card className="mb-8 border-0 shadow-sm">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-medium mb-4">{t("blog.writeComment", language)}</h4>
                      <form onSubmit={handleSubmitComment} className="space-y-4">
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Your comment"
                          className="resize-none"
                          required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                          />
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            required
                          />
                        </div>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                          {t("action.submit", language)}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  {/* Comments list */}
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Avatar>
                          <AvatarFallback>{comment.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{comment.name}</h4>
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
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    <Link to="/blog/2" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="DIY Kombucha"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors">DIY Kombucha at Home</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">8 min read</p>
                      </div>
                    </Link>
                    <Link to="/blog/3" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="Science of Fermentation"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors">The Science of Fermentation</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">6 min read</p>
                      </div>
                    </Link>
                    <Link to="/blog/5" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="Chocolate Avocado Mousse"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors">Chocolate Avocado Mousse</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">4 min read</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['tempeh', 'fermentation', 'kombucha', 'plant-based', 'vegan', 'protein', 'recipes', 'quick-meals'].map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
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

export default BlogPost;
