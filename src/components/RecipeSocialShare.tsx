
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

interface RecipeSocialShareProps {
  title: string;
  description: string;
  url: string;
}

const RecipeSocialShare = ({ title, description, url }: RecipeSocialShareProps) => {
  const { toast } = useToast();
  const { language } = useTheme();
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);
  const shareUrl = encodeURIComponent(url);
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTitle}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareDescription}&url=${shareUrl}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      toast({ 
        title: "Link copied!", 
        description: "The link has been copied to your clipboard."
      });
      
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (err) {
      toast({ 
        title: "Copy failed", 
        description: "Failed to copy link to clipboard.",
        variant: "destructive" 
      });
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => window.open(facebookShareUrl, '_blank')}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => window.open(twitterShareUrl, '_blank')}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5 text-blue-400" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => toast({ title: "Instagram", description: "Opening Instagram sharing..." })}
        aria-label="Share on Instagram"
      >
        <Instagram className="h-5 w-5 text-pink-600" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="More sharing options"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <h4 className="font-medium mb-2">{t("action.share", language)}</h4>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              onClick={copyToClipboard}
            >
              {isLinkCopied ? "Copied!" : "Copy link"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open(`mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`)}
            >
              Email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`)}
            >
              WhatsApp
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RecipeSocialShare;
