
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

interface OrderSummaryProps {
  subtotal: number;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const OrderSummary = ({ subtotal, isSubmitting, onSubmit }: OrderSummaryProps) => {
  const { language } = useTheme();
  const shippingCost = 5.00;
  const total = subtotal + shippingCost;

  return (
    <Card className="border-0 shadow-md dark:bg-gray-800 sticky top-20">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("checkout.orderSummary", language) || "Order Summary"}
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t("checkout.subtotal", language) || "Subtotal"}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t("checkout.shipping", language) || "Shipping"}</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-gray-900 dark:text-white border-t dark:border-gray-700 pt-3 mt-3">
            <span>{t("checkout.total", language) || "Total"}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <Button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (t("checkout.processing", language) || "Processing...") 
              : (t("checkout.placeOrder", language) || "Place Order")}
          </Button>
          <Link to="/marketplace">
            <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-300">
              {t("action.continueShopping", language) || "Continue Shopping"}
            </Button>
          </Link>
        </div>
        
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          {t("checkout.securePayment", language) || "Your payment information is processed securely."}
        </p>
      </CardContent>
    </Card>
  );
};
