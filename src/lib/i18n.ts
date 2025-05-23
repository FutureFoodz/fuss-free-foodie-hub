
type TranslationKey = string;

type Translations = {
  [key: TranslationKey]: {
    en: string;
    sv: string;
  };
};

const translations: Translations = {
  // Navigation
  "nav.home": {
    en: "Home",
    sv: "Hem",
  },
  "nav.blog": {
    en: "Blog",
    sv: "Blogg",
  },
  "nav.recipes": {
    en: "Recipes",
    sv: "Recept",
  },
  "nav.marketplace": {
    en: "Marketplace",
    sv: "Marknad",
  },
  "nav.about": {
    en: "About",
    sv: "Om oss",
  },
  
  // Common buttons/actions
  "action.readMore": {
    en: "Read More",
    sv: "Läs mer",
  },
  "action.addToCart": {
    en: "Add to Cart",
    sv: "Lägg i kundvagn",
  },
  "action.viewAll": {
    en: "View All",
    sv: "Visa alla",
  },
  "action.share": {
    en: "Share",
    sv: "Dela",
  },
  "action.comment": {
    en: "Comment",
    sv: "Kommentera",
  },
  "action.submit": {
    en: "Submit",
    sv: "Skicka",
  },
  "action.cancel": {
    en: "Cancel",
    sv: "Avbryt",
  },
  
  // Product related
  "product.inStock": {
    en: "In Stock",
    sv: "I lager",
  },
  "product.outOfStock": {
    en: "Out of Stock",
    sv: "Slut i lager",
  },
  "product.price": {
    en: "Price",
    sv: "Pris",
  },
  "product.quantity": {
    en: "Quantity",
    sv: "Antal",
  },
  "product.rating": {
    en: "Rating",
    sv: "Betyg",
  },
  "product.reviews": {
    en: "Reviews",
    sv: "Recensioner",
  },
  
  // Blog related
  "blog.readTime": {
    en: "min read",
    sv: "min läsning",
  },
  "blog.comments": {
    en: "Comments",
    sv: "Kommentarer",
  },
  "blog.writeComment": {
    en: "Write a comment",
    sv: "Skriv en kommentar",
  },
  
  // Recipe related
  "recipe.ingredients": {
    en: "Ingredients",
    sv: "Ingredienser",
  },
  "recipe.instructions": {
    en: "Instructions",
    sv: "Instruktioner",
  },
  "recipe.prepTime": {
    en: "Prep time",
    sv: "Förberedelsetid",
  },
  "recipe.cookTime": {
    en: "Cook time",
    sv: "Tillagningstid",
  },
  "recipe.difficulty": {
    en: "Difficulty",
    sv: "Svårighetsgrad",
  },
  "recipe.servings": {
    en: "Servings",
    sv: "Portioner",
  },
  "recipe.createRecipe": {
    en: "Create Recipe",
    sv: "Skapa recept",
  },
  "recipe.editRecipe": {
    en: "Edit Recipe",
    sv: "Redigera recept",
  },
  
  // Theme/Language switcher
  "theme.light": {
    en: "Light Mode",
    sv: "Ljust läge",
  },
  "theme.dark": {
    en: "Dark Mode",
    sv: "Mörkt läge",
  },
  "language.en": {
    en: "English",
    sv: "Engelska",
  },
  "language.sv": {
    en: "Swedish",
    sv: "Svenska",
  },
};

export const t = (key: TranslationKey, language: "en" | "sv" = "en"): string => {
  const translation = translations[key];
  if (!translation) return key;
  return translation[language] || key;
};
