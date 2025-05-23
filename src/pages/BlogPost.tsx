import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage as it's not used
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/utils"; // Import markdownToHtml

interface BlogPost {
  id: number; // Changed from string to number to match JSON
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  content: string; // This is Markdown
  image: string;
  tags: string[];
}

interface Comment {
  id: number;
  name: string;
  date: string;
  content: string;
  avatar: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useTheme();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState(""); // Renamed from comment to avoid conflict
  const [commentName, setCommentName] = useState(""); // Renamed from name
  const [commentEmail, setCommentEmail] = useState(""); // Renamed from email
  const [comments, setComments] = useState<Comment[]>([
    // Initial mock comments, can be cleared or managed separately in a real app
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

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/blogPosts.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts: BlogPost[] = await response.json();
        const postId = parseInt(id as string);
        const foundPost = posts.find(p => p.id === postId);

        if (foundPost) {
          setBlogPost(foundPost);
        } else {
          setError("Blog post not found.");
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(`Failed to load blog post: ${e.message}`);
        } else {
          setError("Failed to load blog post: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

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
    return <div className="container mx-auto px-4 py-12 text-center">Loading post...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  }

  if (!blogPost) {
    return <div className="container mx-auto px-4 py-12 text-center">Blog post not found.</div>;
  }

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
            <Card className="overflow-hidden border-0 shadow-md dark:bg-gray-800">
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(blogPost.content) }}
                />

                {/* Edit Post Button - Placed after content, before tags */}
                {blogPost && (
                  <div className="mt-8 flex justify-end">
                    <Link to={`/blog/${blogPost.id}/edit`}>
                      <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        {t("blog.editPost", language) || "Edit Post"}
                      </Button>
                    </Link>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t dark:border-gray-700 flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm dark:border-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t("action.share", language)}</h3>
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
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-6">
              {/* Related Posts Card - Placeholder, ideally fetch related posts */}
              <Card className="border-0 shadow-md dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Related Posts</h3>
                  <div className="space-y-4">
                    {/* Example related post links - replace with dynamic data if available */}
                    <Link to="/blog/2" className="flex items-start space-x-3 group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop" 
                          className="w-full h-full object-cover"
                          alt="DIY Kombucha"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-green-600 transition-colors dark:text-white">DIY Kombucha at Home</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">8 min read</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Example tags - replace with dynamic data or use blogPost.tags */}
                    {blogPost.tags.slice(0,5).map((tag) => ( // Show some tags from current post or popular ones
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
