import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

// Interface for the raw data fetched from blogPosts.json
interface BlogPostData {
  id: number;
  title: string;
  category: string;
  readTime: string;
  author: string; // author is in blogPosts.json
  date: string;
  content: string; // blogPosts.json has 'content'
  image: string;
  tags: string[];
}

// Interface for what the Blog component will store in its state and use for rendering
interface BlogPostListDisplay {
  id: number;
  title: string;
  category: string;
  readTime: string;
  excerpt: string; // For list display, we use an excerpt
  image: string;
  date: string;
  tags: string[];
}

const Blog = () => {
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPostListDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { language } = useTheme();

  const categories = ["All", "Recipes", "DIY", "Education", "Events"];

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/blogPosts.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BlogPostData[] = await response.json();
        const mappedData: BlogPostListDisplay[] = data.map(post => ({
          id: post.id,
          title: post.title,
          category: post.category,
          readTime: post.readTime,
          // Create a short excerpt from content. For now, take the first 150 chars.
          // In a real app, this might be a dedicated field or a more sophisticated truncation.
          excerpt: post.content.substring(0, 150) + (post.content.length > 150 ? "..." : ""),
          image: post.image,
          date: post.date,
          tags: post.tags,
        }));
        setAllBlogPosts(mappedData);
      } catch (e) {
        if (e instanceof Error) {
          setError(`Failed to load blog posts: ${e.message}`);
        } else {
          setError("Failed to load blog posts: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  const filteredPosts = allBlogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading posts...</div>;
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
              FutureFoodz Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Recipes, DIY guides, and everything you need to know about plant-based living
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Create Button */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
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
                placeholder={t("blog.searchPosts", language) || "Search posts..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-end">
            <Link to="/blog/new">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                {t("blog.createPost", language) || "Create New Post"}
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${post.image}?w=400&h=300&fit=crop`}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 cursor-pointer line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => ( // Show up to 3 tags
                        <Badge key={index} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700">
                        {t("action.readMore", language)}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
