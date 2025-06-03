export enum LanguageCode {
  EN = 'EN',
  AR = 'AR',
}

export interface Product {
  id: string;
  name: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  price: number;
  imageUrl: string;
  categoryId: string;
  images: string[];
  details: {
    EN: {
      features: string[];
      specifications: { [key: string]: string };
    };
    AR: {
      features: string[];
      specifications: { [key: string]: string };
    };
  };
}

export interface Category {
  id: string;
  name: Record<LanguageCode, string>;
}

export interface Ad {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  placement: 'homepage-banner' | 'sidebar'; // Example placements
  isActive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export interface FAQ {
  id: string;
  question: Record<LanguageCode, string>;
  answer: Record<LanguageCode, string>;
}

export interface StoreSettings {
  storeName: string;
  defaultLanguage: LanguageCode;
  currencySymbol: string;
  whatsappNumber: string; // Full number including country code e.g., +11234567890
  socialMediaLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Type for translation keys and their string values
export type TranslationKeys = 
  | 'appName' | 'home' | 'products' | 'cart' | 'admin' | 'login' | 'logout'
  | 'addToCart' | 'removeFromCart' | 'viewCart' | 'checkoutViaWhatsApp' | 'quantity'
  | 'features' | 'specifications'
  | 'price' | 'total' | 'emptyCart' | 'searchProducts' | 'filterByCategory'
  | 'allCategories' | 'productName' | 'productDescription' | 'productPrice' | 'productCategory' | 'productImageURL'
  | 'categoryName' | 'adTitle' | 'adDescription' | 'adImageURL' | 'adLinkURL' | 'adPlacement' | 'adIsActive'
  | 'saveChanges' | 'cancel' | 'delete' | 'edit' | 'add' | 'new'
  | 'dashboard' | 'manageProducts' | 'manageCategories' | 'manageAds' | 'storeSettings' | 'chatbotManagement'
  | 'statistics' | 'totalProducts' | 'totalCategories' | 'totalAds' | 'simulatedVisitors' | 'simulatedOrders'
  | 'storeName' | 'defaultLanguage' | 'currencySymbol' | 'whatsappNumber' | 'socialMediaLinks' | 'facebook' | 'instagram' | 'twitter'
  | 'faqQuestion' | 'faqAnswer' | 'askChatbot' | 'typeYourMessage' | 'sendMessage' | 'chatbotWelcome' | 'chatbotLoading'
  | 'errorOccurred' | 'password' | 'adminLogin' | 'loginFailed' | 'selectLanguage' | 'ourProducts' | 'featuredAds'
  | 'confirmDelete' | 'areYouSureDelete' | 'yesDelete' | 'noCancel' | 'actions' | 'description' | 'title' | 'link' | 'imageURL' | 'placement' | 'active'
  | 'internalAds' | 'quickHelp' | 'failedToParseJsonResponse' | 'noProductsFound' | 'continueShopping' | 'orderSummary' | 'sendOrder'
  | 'selectCategory' | 'all' | 'priceRange' | 'minPrice' | 'maxPrice' | 'applyFilters' | 'resetFilters' | 'details'
  | 'manageFAQs' | 'addFAQ' | 'editFAQ' | 'deleteFAQ' | 'question' | 'answer'  | 'settingsSuccessfullySaved' | 'itemAddedToCart' | 'itemRemovedFromCart' | 'cartUpdated'
  | 'chatWithOurAssistant' | 'howCanIHelpYou' | 'search' | 'category'
  | 'productDetails' | 'close' | 'noAdsAvailable' | 'learnMore'
  | 'productNotFound' | 'goBack' | 'inStock'
  | 'exploreOurCollection' | 'productsFound' | 'sortBy' | 'name' | 'priceLowToHigh' | 'priceHighToLow' 
  | 'newest' | 'showing' | 'of' | 'tryDifferentFilters' | 'previous' | 'next'
  | 'backToStore';

export type Translations = Record<TranslationKeys, string>;

// Gemini specific types (custom definitions)
export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiContent {
  parts: GeminiPart[];
  role?: string;
}

export interface GeminiSafetySetting {
  category: string;
  threshold: string; // This differs from SDK's HarmBlockThreshold which is an enum
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  responseMimeType?: "text/plain" | "application/json";
  thinkingConfig?: { thinkingBudget: number };
  systemInstruction?: string;
  seed?: number;
}

export interface GeminiTool {
  googleSearch?: Record<string, never>; // Empty object for googleSearch
}

export interface GeminiGenerateContentRequest {
  contents: GeminiContent[] | GeminiContent | string;
  safetySettings?: GeminiSafetySetting[];
  generationConfig?: GeminiGenerationConfig;
  tools?: GeminiTool[];
  model: string; // Model name required here
}
export interface GeminiGroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}
export interface GeminiGroundingMetadata {
  webSearchQueries?: string[];
  groundingAttributions?: unknown[]; 
  retrievableContexts?: unknown[]; 
  groundingChunks?: GeminiGroundingChunk[];
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason: string;
  index: number;
  safetyRatings: GeminiSafetySetting[]; // This uses custom GeminiSafetySetting
  tokenCount?: number;
  groundingMetadata?: GeminiGroundingMetadata;
}
export interface GeminiGenerateContentResponse { // Custom Response type
  candidates?: GeminiCandidate[]; // Made optional to avoid conflict if SDK response is cast directly and candidates structure differs.
  // promptFeedback?: PromptFeedback; // Type this if needed
  text: string; // Helper to get text directly
}

// Generic item type for CRUD operations. Name is optional to accommodate Ad and FAQ.
export interface CrudItem {
  id: string;
  name?: Record<LanguageCode, string> | string; // Made optional
  [key: string]: any;
}
