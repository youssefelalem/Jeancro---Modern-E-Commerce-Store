/**
 * مزود Context الرئيسي للتطبيق
 * يحتوي على جميع البيانات والوظائف المشتركة
 */

import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { AppContext } from './AppContext';
import { 
  Product, 
  Category, 
  Ad, 
  CartItem, 
  LanguageCode, 
  StoreSettings, 
  FAQ, 
  ChatMessage,
  TranslationKeys
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ADS, 
  INITIAL_FAQS, 
  SUPPORTED_LANGUAGES, 
  TRANSLATIONS, 
  ADMIN_MOCK_PASSWORD 
} from '../constants';
import { getChatbotResponse } from '../geminiService';
import { generateId } from '../utils/generateId';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { getStoreSettings, saveStoreSettings } from '../utils/storeSettings';

/**
 * مزود Context الرئيسي للتطبيق
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // حالات البيانات الأساسية
  const [products, setProducts] = useState<Product[]>(() => 
    loadFromLocalStorage('jeancro-products', INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromLocalStorage('jeancro-categories', INITIAL_CATEGORIES)
  );
  const [ads, setAds] = useState<Ad[]>(() => 
    loadFromLocalStorage('jeancro-ads', INITIAL_ADS)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() => 
    loadFromLocalStorage('jeancro-cart', [])
  );
  
  // الحصول على إعدادات المتجر المركزية
  const [storeSettings, setStoreSettingsState] = useState<StoreSettings>(() => getStoreSettings());
  
  // تعيين اللغة الحالية بناءً على إعدادات المتجر
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const savedLang = loadFromLocalStorage('jeancro-language', storeSettings.defaultLanguage);
    return SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : storeSettings.defaultLanguage;
  });
  
  const [faqs, setFaqs] = useState<FAQ[]>(() => 
    loadFromLocalStorage('jeancro-faqs', INITIAL_FAQS)
  );
  // حالات واجهة المستخدم
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => 
    loadFromLocalStorage('jeancro-admin-loggedin', false)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  // حالة الإشعارات
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    id: string;
  } | null>(null);

  // تأثيرات جانبية لحفظ البيانات
  useEffect(() => {
    saveToLocalStorage('jeancro-products', products);
  }, [products]);

  useEffect(() => {
    saveToLocalStorage('jeancro-categories', categories);
  }, [categories]);

  useEffect(() => {
    saveToLocalStorage('jeancro-ads', ads);
  }, [ads]);

  useEffect(() => {
    saveToLocalStorage('jeancro-cart', cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveToLocalStorage('jeancro-language', currentLanguage);
    document.documentElement.lang = currentLanguage.toLowerCase();
    document.documentElement.dir = currentLanguage === LanguageCode.AR ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  useEffect(() => {
    saveToLocalStorage('jeancro-faqs', faqs);
  }, [faqs]);

  useEffect(() => {
    saveToLocalStorage('jeancro-admin-loggedin', isAdminLoggedIn);
  }, [isAdminLoggedIn]);
  // دوال الترجمة
  const translations = TRANSLATIONS[currentLanguage];
  const t = useCallback(
    (key: TranslationKeys) => translations[key] || key,
    [translations]
  );

  // دالة عرض الإشعارات
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, id: generateId() });
  };

  // وظائف إدارة سلة التسوق
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    showToast(t('itemAddedToCart'), 'success');
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    showToast(t('itemRemovedFromCart'), 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      showToast(t('cartUpdated'), 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // وظائف إدارة اللغة
  const setCurrentLanguage = (lang: LanguageCode) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setCurrentLanguageState(lang);
    }
  };

  // وظائف إدارة Chatbot
  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);

  const sendChatMessage = async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    const historyForGemini = chatMessages
      .map(msg => ({
        role: msg.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.text }],
      }))
      .filter(msg => msg.role === 'user' || msg.role === 'model');    try {
      const botResponseText = await getChatbotResponse(
        messageText,
        historyForGemini,
        faqs,
        currentLanguage,
        products
      );
      const botMessage: ChatMessage = {
        id: generateId(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        text: t('errorOccurred'),
        sender: 'system',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // وظائف إدارة المسؤول
  const loginAdmin = (password: string) => {
    if (password === ADMIN_MOCK_PASSWORD) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };
  
  // وظيفة لتحديث إعدادات المتجر المركزية
  const setStoreSettings = (settings: StoreSettings | ((prevSettings: StoreSettings) => StoreSettings)) => {
    if (typeof settings === 'function') {
      const updatedSettings = settings(storeSettings);
      saveStoreSettings(updatedSettings);
      setStoreSettingsState(updatedSettings);
    } else {
      saveStoreSettings(settings);
      setStoreSettingsState(settings);
    }
  };

  // مزامنة البيانات مع الثوابت
  const syncWithConstants = useCallback(() => {
    const savedProducts = loadFromLocalStorage('jeancro-products', []);
    const savedCategories = loadFromLocalStorage('jeancro-categories', []);
    const savedAds = loadFromLocalStorage('jeancro-ads', []);
    const savedFaqs = loadFromLocalStorage('jeancro-faqs', []);

    if (JSON.stringify(savedProducts) !== JSON.stringify(INITIAL_PRODUCTS)) {
      setProducts(INITIAL_PRODUCTS);
      saveToLocalStorage('jeancro-products', INITIAL_PRODUCTS);
    }

    if (JSON.stringify(savedCategories) !== JSON.stringify(INITIAL_CATEGORIES)) {
      setCategories(INITIAL_CATEGORIES);
      saveToLocalStorage('jeancro-categories', INITIAL_CATEGORIES);
    }

    if (JSON.stringify(savedAds) !== JSON.stringify(INITIAL_ADS)) {
      setAds(INITIAL_ADS);
      saveToLocalStorage('jeancro-ads', INITIAL_ADS);
    }

    if (JSON.stringify(savedFaqs) !== JSON.stringify(INITIAL_FAQS)) {
      setFaqs(INITIAL_FAQS);
      saveToLocalStorage('jeancro-faqs', INITIAL_FAQS);
    }
  }, []);

  useEffect(() => {
    syncWithConstants();
  }, [syncWithConstants]);
  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        ads,
        setAds,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        currentLanguage,
        setCurrentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        translations,
        t,
        storeSettings,
        setStoreSettings,
        isCartOpen,
        setIsCartOpen,
        faqs,
        setFaqs,
        isChatbotOpen,
        toggleChatbot,
        chatMessages,
        sendChatMessage,
        isChatLoading,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        showToast,
        toast,
        setToast,
      }}    >
      {children}
    </AppContext.Provider>
  );
};
