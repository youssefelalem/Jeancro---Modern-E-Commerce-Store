/**
 * ملف تعريف Context الرئيسي للتطبيق
 * يحتوي على واجهة AppContextType وإنشاء Context
 */

import { createContext } from 'react';
import { 
  Product, 
  Category, 
  Ad, 
  CartItem, 
  LanguageCode, 
  Translations, 
  TranslationKeys, 
  StoreSettings, 
  FAQ, 
  ChatMessage 
} from '../types';

/**
 * واجهة Context الرئيسية للتطبيق
 * تحتوي على جميع البيانات والوظائف المشتركة عبر التطبيق
 */
export interface AppContextType {
  // إدارة المنتجات
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  // إدارة الفئات
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  
  // إدارة الإعلانات
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  
  // إدارة سلة التسوق
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
    // إدارة اللغة والترجمة
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  supportedLanguages: LanguageCode[]; // إضافة قائمة اللغات المدعومة
  translations: Translations; // كائن الترجمات للغة الحالية
  t: (key: TranslationKeys) => string; // دالة الحصول على ترجمة محددة
  
  // إعدادات المتجر
  storeSettings: StoreSettings;
  setStoreSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  
  // إدارة عرض سلة التسوق
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // إدارة الأسئلة الشائعة
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
  
  // إدارة Chatbot
  isChatbotOpen: boolean;
  toggleChatbot: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (message: string) => Promise<void>;
  isChatLoading: boolean;
  
  // إدارة المسؤول
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  // نظام الإشعارات
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; id: string } | null;
  setToast: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' | 'info'; id: string } | null>>;
}

/**
 * إنشاء Context للتطبيق
 */
export const AppContext = createContext<AppContextType | undefined>(undefined);
