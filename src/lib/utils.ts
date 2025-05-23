import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple markdown to HTML conversion
// In a real app, you would use a proper markdown library like marked.js
export function markdownToHtml(markdown: string): string {
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
    .replace(/<\/li>\n<li/gim, '</li><li') // Handle multiple list items
    .replace(/(<ul class="list-disc my-2">)?(<li.*<\/li>)(<\/ul>)?/gim, function(match,p1,p2,p3) { // Wrap with <ul> if not already
      if (p1) return match; // Already wrapped
      return '<ul class="list-disc my-2">' + p2 + '</ul>';
    })
    // Numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/<\/li>\n<li/gim, '</li><li') // Handle multiple list items
    .replace(/(<ol class="list-decimal my-2">)?(<li.*<\/li>)(<\/ol>)?/gim, function(match,p1,p2,p3) { // Wrap with <ol> if not already
        if (p1) return match; // Already wrapped
        return '<ol class="list-decimal my-2">' + p2 + '</ol>';
    })
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400">$1</blockquote>')
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="rounded-md my-4 max-w-full h-auto">')
    // Paragraphs - More robust handling
    .split('\n\n') // Split by double line breaks (common paragraph separator)
    .map(paragraph => {
      if (!paragraph.trim()) return '';
      // Avoid wrapping existing html tags in <p>
      if (/^\s*<\/?(h[1-6]|ul|ol|li|blockquote|img|pre|table)/i.test(paragraph)) {
        return paragraph;
      }
      return '<p class="my-2">' + paragraph.trim().replace(/\n/g, '<br />') + '</p>'; // Convert single newlines in paragraph to <br>
    })
    .join('')
    // Final pass to clean up any remaining single newlines that weren't converted to <br /> within paragraphs
    .replace(/\n(?!<\/p>|<\/?(h[1-6]|ul|ol|li|blockquote|img|pre|table))/g, '<br />');
}
