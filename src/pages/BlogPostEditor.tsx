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
import { markdownToHtml } from "@/lib/utils";

// Interface for the form data state
interface BlogPostFormData {
  title: string;
  category: string;
  author: string;
  date: string; // Should be editable, perhaps with a date picker in a real app
  image: string; // Unsplash ID or path
  tags: string; // Comma-separated string
  content: string; // Markdown content of the blog post
}

// Interface for the actual blog post object (matching blogPosts.json)
interface BlogPost {
  id: number;
  title: string;
  category: string;
  readTime: string; // This might be auto-generated or a fixed value on save
  author: string;
  date: string;
  content: string; // Markdown
  image: string;
  tags: string[];
}

const BlogPostEditor = () => {
  const { id: postIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useTheme();
  const isEditMode = postIdParam !== undefined;
  const numericId = isEditMode ? parseInt(postIdParam as string) : undefined;

  const initialFormState: BlogPostFormData = {
    title: "",
    category: "Education", // Default category
    author: "",
    date: new Date().toISOString().split('T')[0], // Default to today's date
    image: "",
    tags: "",
    content: "# New Blog Post Title\n\nStart writing your blog post content here using Markdown...",
  };

  const [postForm, setPostForm] = useState<BlogPostFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Effect to fetch blog post data if in edit mode
  useEffect(() => {
    if (isEditMode && numericId !== undefined) {
      setIsLoading(true);
      fetch("/data/blogPosts.json") // Fetch the list of all blog posts
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((postsData: BlogPost[]) => {
          const postToEdit = postsData.find(p => p.id === numericId); // Find the specific post to edit
          if (postToEdit) {
            // Populate the form with the fetched post data
            setPostForm({
              title: postToEdit.title,
              category: postToEdit.category,
              author: postToEdit.author,
              date: postToEdit.date, 
              image: postToEdit.image,
              tags: postToEdit.tags.join(", "), // Convert tags array to comma-separated string for form
              content: postToEdit.content,
            });
          } else {
            setError(`Blog post with ID ${numericId} not found.`);
            toast({ title: "Error", description: `Post with ID ${numericId} not found.`, variant: "destructive" });
          }
        })
        .catch(e => {
          console.error("Failed to load blog post for editing:", e);
          setError("Failed to load blog post data.");
          toast({ title: "Error", description: "Could not load post data.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEditMode, numericId, toast]);

  const handleInputChange = (field: keyof BlogPostFormData, value: string) => {
    setPostForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postForm.title || !postForm.content || !postForm.author || !postForm.date) {
      toast({ title: "Missing required fields", description: "Please fill in Title, Author, Date, and Content.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch the current list of blog posts to modify it
      const response = await fetch("/data/blogPosts.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      let posts: BlogPost[] = await response.json();

      // Estimate read time based on content word count
      const words = postForm.content.split(/\s+/).filter(Boolean).length; // Filter empty strings from split
      const readTimeEstimate = Math.ceil(words / 200); // Average reading speed: 200 words per minute

      // Prepare the blog post data from the form for saving
      const submittedPostData: Omit<BlogPost, 'id' | 'readTime'> = {
        title: postForm.title,
        category: postForm.category,
        author: postForm.author,
        date: postForm.date,
        image: postForm.image,
        tags: postForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag), // Convert comma-separated string to array
        content: postForm.content,
      };
      
      let newPostId = numericId; // Used for navigation after submit

      if (isEditMode && numericId !== undefined) {
        // Update existing blog post
        posts = posts.map(p => 
          p.id === numericId 
            ? { ...submittedPostData, id: numericId, readTime: `${readTimeEstimate} min read` } 
            : p
        );
      } else {
        // Create new blog post: Generate a new ID (max ID + 1)
        newPostId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
        const newFullPost: BlogPost = { 
          ...submittedPostData, 
          id: newPostId, 
          readTime: `${readTimeEstimate} min read` 
        };
        posts.push(newFullPost);
      }

      // Simulate saving by logging the updated JSON to the console
      const updatedJson = JSON.stringify(posts, null, 2);
      console.log("Updated blogPosts.json content (simulated save):\n", updatedJson);

      toast({
        title: isEditMode ? "Blog Post Updated (Simulated)" : "Blog Post Created (Simulated)",
        description: `${postForm.title} processed. JSON in console. Copy to public/data/blogPosts.json to persist.`,
        duration: 9000,
      });
      
      // Navigate to the blog post's detail page (either existing or new)
      navigate(isEditMode && numericId ? `/blog/${numericId}` : `/blog/${newPostId}`);

    } catch (err) {
      console.error("Error during blog post submission:", err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      toast({ title: "Submission Error", description: `Could not process post: ${message}. Check console.`, variant: "destructive" });
    } finally {
      setIsLoading(false); // Ensure loading is stopped on error or success
    }
  };
  
  if (isLoading && isEditMode) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading post editor...</div>;
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
                {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
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
                  <h2 className="text-xl font-bold mb-2 dark:text-white">{postForm.title || "Post Title"}</h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    By {postForm.author || "Author"} on {postForm.date || "Date"} | Category: {postForm.category}
                  </div>
                  {postForm.image && <img src={`https://images.unsplash.com/${postForm.image}?w=800&h=400&fit=crop`} alt={postForm.title} className="rounded-md my-4 max-w-full h-auto" />}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {postForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag).map((tag, index) => (
                      <Badge key={index} variant="secondary">#{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(postForm.content) }} />
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title <span className="text-red-500">*</span></Label>
                    <Input id="title" value={postForm.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Enter post title" className="dark:bg-gray-700" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={postForm.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="dark:bg-gray-700"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Recipes">Recipes</SelectItem>
                        <SelectItem value="DIY">DIY</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
                    <Input id="author" value={postForm.author} onChange={(e) => handleInputChange("author", e.target.value)} placeholder="Author's name" className="dark:bg-gray-700" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                    <Input id="date" type="date" value={postForm.date} onChange={(e) => handleInputChange("date", e.target.value)} className="dark:bg-gray-700" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image">Image Filename (from Unsplash, e.g., photo-xxxxxxxx)</Label>
                    <Input id="image" value={postForm.image} onChange={(e) => handleInputChange("image", e.target.value)} placeholder="photo-1618160702438-9b02ab6515c9" className="dark:bg-gray-700" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" value={postForm.tags} onChange={(e) => handleInputChange("tags", e.target.value)} placeholder="kombucha, fermentation, health" className="dark:bg-gray-700" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown) <span className="text-red-500">*</span></Label>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Use Markdown for formatting.</div>
                  <Textarea id="content" value={postForm.content} onChange={(e) => handleInputChange("content", e.target.value)} className="min-h-[400px] font-mono dark:bg-gray-700" required />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate(isEditMode && numericId ? `/blog/${numericId}` : '/blog')} className="dark:border-gray-600 dark:text-gray-300" disabled={isLoading}>{t("action.cancel", language)}</Button>
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

export default BlogPostEditor;
