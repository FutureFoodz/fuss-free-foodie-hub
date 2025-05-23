
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CartItemCard } from "./CartItemCard";
import { CartItem } from "@/components/ShoppingCart";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

interface CartItemListProps {
  items: CartItem[];
  onRemove: (id: string | number) => void;
  onQuantityChange: (id: string | number, change: number) => void;
}

export const CartItemList = ({ items, onRemove, onQuantityChange }: CartItemListProps) => {
  const { language } = useTheme();

  return (
    <Card className="border-0 shadow-md dark:bg-gray-800 mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("cart.yourItems", language) || "Your Items"}
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onRemove={onRemove}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
