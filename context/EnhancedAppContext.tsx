/**
 * مُحسن لإدارة حالة التطبيق
 * يدعم actions وreducers لإدارة أفضل للحالة
 */

import { createContext, useContext } from 'react';
import { Product, Category, Ad, CartItem, StoreSettings, FAQ, LanguageCode } from '../types';
import { INITIAL_STORE_SETTINGS } from '../constants';

// أنواع الأحداث (Actions)
export type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_ADS'; payload: Ad[] }
  | { type: 'ADD_AD'; payload: Ad }
  | { type: 'UPDATE_AD'; payload: { id: string; updates: Partial<Ad> } }
  | { type: 'DELETE_AD'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LANGUAGE'; payload: LanguageCode }
  | { type: 'SET_STORE_SETTINGS'; payload: Partial<StoreSettings> }
  | { type: 'SET_ADMIN_LOGIN'; payload: boolean }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_CHATBOT_OPEN'; payload: boolean }
  | { type: 'SET_FAQS'; payload: FAQ[] }
  | { type: 'ADD_FAQ'; payload: FAQ }
  | { type: 'UPDATE_FAQ'; payload: { id: string; updates: Partial<FAQ> } }
  | { type: 'DELETE_FAQ'; payload: string };

// حالة التطبيق
export interface AppState {
  // بيانات المنتجات والفئات
  products: Product[];
  categories: Category[];
  ads: Ad[];
  faqs: FAQ[];
  
  // إعدادات المتجر
  storeSettings: StoreSettings;
  currentLanguage: LanguageCode;
  
  // السلة
  cartItems: CartItem[];
  isCartOpen: boolean;
  
  // المصادقة
  isAdminLoggedIn: boolean;
  
  // واجهة المستخدم
  isChatbotOpen: boolean;
  
  // Loading states
  loading: {
    products: boolean;
    categories: boolean;
    ads: boolean;
    cart: boolean;
  };
  
  // Error states
  errors: {
    products: string | null;
    categories: string | null;
    ads: string | null;
    cart: string | null;
  };
}

// الحالة الأولية
export const initialAppState: AppState = {  products: [],
  categories: [],
  ads: [],
  faqs: [],
  storeSettings: INITIAL_STORE_SETTINGS,
  currentLanguage: LanguageCode.AR,
  cartItems: [],
  isCartOpen: false,
  isAdminLoggedIn: false,
  isChatbotOpen: false,
  loading: {
    products: false,
    categories: false,
    ads: false,
    cart: false
  },
  errors: {
    products: null,
    categories: null,
    ads: null,
    cart: null
  }
};

// Reducer function
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // إدارة المنتجات
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        errors: { ...state.errors, products: null }
      };
      
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
      
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.updates }
            : product
        )
      };
      
    case 'DELETE_PRODUCT':      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
        // إزالة المنتج من السلة أيضاً
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      };

    // إدارة الفئات
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
        errors: { ...state.errors, categories: null }
      };
      
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
      
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.updates }
            : category
        )
      };
      
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };

    // إدارة الإعلانات
    case 'SET_ADS':
      return {
        ...state,
        ads: action.payload,
        errors: { ...state.errors, ads: null }
      };
      
    case 'ADD_AD':
      return {
        ...state,
        ads: [...state.ads, action.payload]
      };
      
    case 'UPDATE_AD':
      return {
        ...state,
        ads: state.ads.map(ad =>
          ad.id === action.payload.id
            ? { ...ad, ...action.payload.updates }
            : ad
        )
      };
      
    case 'DELETE_AD':
      return {
        ...state,
        ads: state.ads.filter(ad => ad.id !== action.payload)
      };    // إدارة السلة
    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(
        item => item.id === action.payload.product.id
      );
      
      if (existingItemIndex > -1) {
        return {
          ...state,
          cartItems: state.cartItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            ...action.payload.product,
            quantity: action.payload.quantity
          }
        ]
      };
        case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      };
      
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0) // إزالة العناصر ذات الكمية 0
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      };

    // إدارة الأسئلة الشائعة
    case 'SET_FAQS':
      return {
        ...state,
        faqs: action.payload
      };
      
    case 'ADD_FAQ':
      return {
        ...state,
        faqs: [...state.faqs, action.payload]
      };
      
    case 'UPDATE_FAQ':
      return {
        ...state,
        faqs: state.faqs.map(faq =>
          faq.id === action.payload.id
            ? { ...faq, ...action.payload.updates }
            : faq
        )
      };
      
    case 'DELETE_FAQ':
      return {
        ...state,
        faqs: state.faqs.filter(faq => faq.id !== action.payload)
      };

    // إدارة اللغة والإعدادات
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload
      };
      
    case 'SET_STORE_SETTINGS':
      return {
        ...state,
        storeSettings: { ...state.storeSettings, ...action.payload }
      };

    // إدارة المصادقة
    case 'SET_ADMIN_LOGIN':
      return {
        ...state,
        isAdminLoggedIn: action.payload
      };

    // إدارة واجهة المستخدم
    case 'SET_CART_OPEN':
      return {
        ...state,
        isCartOpen: action.payload
      };
      
    case 'SET_CHATBOT_OPEN':
      return {
        ...state,
        isChatbotOpen: action.payload
      };

    default:
      return state;
  }
};

// Context للحالة والDispatch
export const AppStateContext = createContext<AppState | undefined>(undefined);
export const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

// Custom hooks للوصول للحالة والDispatch
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
};

// Custom hooks لوظائف محددة
export const useProducts = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return {
    products: state.products,
    loading: state.loading.products,
    error: state.errors.products,
    setProducts: (products: Product[]) => dispatch({ type: 'SET_PRODUCTS', payload: products }),
    addProduct: (product: Product) => dispatch({ type: 'ADD_PRODUCT', payload: product }),
    updateProduct: (id: string, updates: Partial<Product>) => 
      dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates } }),
    deleteProduct: (id: string) => dispatch({ type: 'DELETE_PRODUCT', payload: id })
  };
};

export const useCart = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return {    cartItems: state.cartItems,
    isCartOpen: state.isCartOpen,
    itemCount: state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    addToCart: (product: Product, quantity = 1) => 
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } }),
    removeFromCart: (productId: string) => 
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId }),
    updateQuantity: (productId: string, quantity: number) => 
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    setCartOpen: (isOpen: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: isOpen })
  };
};

export const useCategories = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return {
    categories: state.categories,
    loading: state.loading.categories,
    error: state.errors.categories,
    setCategories: (categories: Category[]) => dispatch({ type: 'SET_CATEGORIES', payload: categories }),
    addCategory: (category: Category) => dispatch({ type: 'ADD_CATEGORY', payload: category }),
    updateCategory: (id: string, updates: Partial<Category>) => 
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } }),
    deleteCategory: (id: string) => dispatch({ type: 'DELETE_CATEGORY', payload: id })
  };
};

export const useAds = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return {
    ads: state.ads,
    loading: state.loading.ads,
    error: state.errors.ads,
    activeAds: state.ads.filter(ad => ad.isActive),
    setAds: (ads: Ad[]) => dispatch({ type: 'SET_ADS', payload: ads }),
    addAd: (ad: Ad) => dispatch({ type: 'ADD_AD', payload: ad }),
    updateAd: (id: string, updates: Partial<Ad>) => 
      dispatch({ type: 'UPDATE_AD', payload: { id, updates } }),
    deleteAd: (id: string) => dispatch({ type: 'DELETE_AD', payload: id })
  };
};
