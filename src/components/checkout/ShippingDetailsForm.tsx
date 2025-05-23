
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/ThemeProvider";
import { t } from "@/lib/i18n";

export interface ShippingDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  notes: string;
}

interface ShippingDetailsFormProps {
  shippingDetails: ShippingDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ShippingDetailsForm = ({ shippingDetails, onChange }: ShippingDetailsFormProps) => {
  const { language } = useTheme();

  return (
    <Card className="border-0 shadow-md dark:bg-gray-800">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("checkout.shippingDetails", language) || "Shipping Details"}
        </h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("checkout.fullName", language) || "Full Name"}
              </label>
              <Input
                id="name"
                name="name"
                required
                value={shippingDetails.name}
                onChange={onChange}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("checkout.email", language) || "Email"}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={shippingDetails.email}
                onChange={onChange}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("checkout.address", language) || "Address"}
            </label>
            <Input
              id="address"
              name="address"
              required
              value={shippingDetails.address}
              onChange={onChange}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("checkout.city", language) || "City"}
              </label>
              <Input
                id="city"
                name="city"
                required
                value={shippingDetails.city}
                onChange={onChange}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("checkout.postalCode", language) || "Postal Code"}
              </label>
              <Input
                id="postalCode"
                name="postalCode"
                required
                value={shippingDetails.postalCode}
                onChange={onChange}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("checkout.country", language) || "Country"}
              </label>
              <Input
                id="country"
                name="country"
                required
                value={shippingDetails.country}
                onChange={onChange}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("checkout.phone", language) || "Phone Number"}
            </label>
            <Input
              id="phone"
              name="phone"
              required
              value={shippingDetails.phone}
              onChange={onChange}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("checkout.notes", language) || "Order Notes (Optional)"}
            </label>
            <Textarea
              id="notes"
              name="notes"
              placeholder={t("checkout.notesPlaceholder", language) || "Special instructions for delivery, allergies, etc."}
              value={shippingDetails.notes}
              onChange={onChange}
              className="resize-none dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
