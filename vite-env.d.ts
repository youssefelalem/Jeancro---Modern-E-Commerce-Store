/// <reference types="vite/client" />

interface ImportMetaEnv {
  // متغيرات API المطلوبة
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_BACKEND_URL: string;
  
  // إعدادات المتجر الأساسية
  readonly VITE_STORE_NAME: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_STORE_CURRENCY: string;
  readonly VITE_STORE_CURRENCY_SYMBOL: string;
  
  // إعدادات التطوير
  readonly VITE_DEBUG: string;
  readonly VITE_ENVIRONMENT: string;
  readonly NODE_ENV: string;
  
  // إعدادات التحليلات (اختيارية)
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_FACEBOOK_PIXEL_ID: string;
  
  // إعدادات الدفع (اختيارية)
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_PAYPAL_CLIENT_ID: string;
  
  // إعدادات البريد الإلكتروني (اختيارية)
  readonly VITE_EMAIL_SERVICE_URL: string;
  readonly VITE_CONTACT_EMAIL: string;
  
  // إعدادات التخزين والأداء
  readonly VITE_STORAGE_TYPE: string;
  readonly VITE_CACHE_ENABLED: string;
  readonly VITE_IMAGE_OPTIMIZATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
