
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

export const EmptyCart = () => {
  const { language } = useTheme();
  
  return (
    <Card className="border-0 shadow-md dark:bg-gray-800">
      <CardContent className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t("cart.empty", language) || "Your cart is empty"}
        </p>
        <Link to="/marketplace">
          <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
            {t("action.continueShopping", language) || "Continue Shopping"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
