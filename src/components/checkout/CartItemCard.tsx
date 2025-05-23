
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/components/ShoppingCart";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string | number) => void;
  onQuantityChange: (id: string | number, change: number) => void;
}

export const CartItemCard = ({ item, onRemove, onQuantityChange }: CartItemCardProps) => {
  return (
    <div className="flex items-center border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
        <img 
          src={`https://images.unsplash.com/${item.image}?w=100&h=100&fit=crop`} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
            <Badge variant="outline" className="mt-1 dark:border-gray-600">{item.category}</Badge>
          </div>
          <span className="font-semibold text-green-600 dark:text-green-400">{item.price}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-7 w-7 rounded-full dark:border-gray-600"
              onClick={() => onQuantityChange(item.id, -1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-gray-700 dark:text-gray-300 w-6 text-center">{item.quantity}</span>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-7 w-7 rounded-full dark:border-gray-600"
              onClick={() => onQuantityChange(item.id, 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-transparent"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
