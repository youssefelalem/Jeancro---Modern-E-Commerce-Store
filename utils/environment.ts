/**
 * إعدادات بيئة التطوير والإنتاج
 */

interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  apiUrl: string;
  baseUrl: string;
  backendUrl: string;
  geminiApiKey: string;
  storageType: 'localStorage' | 'api';
  
  // إعدادات المتجر
  storeName: string;
  defaultLanguage: string;
  storeCurrency: string;
  currencySymbol: string;
  
  // إعدادات التطوير
  debug: boolean;
  environment: string;
  
  // إعدادات التحليلات
  gaTrackingId?: string;
  facebookPixelId?: string;
  
  // إعدادات الدفع
  stripePublicKey?: string;
  paypalClientId?: string;
  
  // إعدادات البريد الإلكتروني
  emailServiceUrl?: string;
  contactEmail?: string;
  
  // إعدادات الأداء
  cacheEnabled: boolean;
  imageOptimization: boolean;
}

/**
 * الحصول على إعدادات البيئة الحالية
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  return {
    isDevelopment,
    isProduction,
    
    // عناوين API
    apiUrl: import.meta.env.VITE_API_URL || (isProduction 
      ? 'https://your-domain.vercel.app/api' 
      : 'http://localhost:5173/api'),
    baseUrl: import.meta.env.VITE_BASE_URL || (isProduction
      ? 'https://your-domain.vercel.app'
      : 'http://localhost:3000'),
    backendUrl: import.meta.env.VITE_BACKEND_URL || (isProduction
      ? 'https://your-backend.vercel.app'
      : 'http://localhost:8000'),
    
    // مفاتيح API
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    
    // إعدادات المتجر
    storeName: import.meta.env.VITE_STORE_NAME || 'Jeancro',
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'AR',
    storeCurrency: import.meta.env.VITE_STORE_CURRENCY || 'MAD',
    currencySymbol: import.meta.env.VITE_STORE_CURRENCY_SYMBOL || 'د.م',
    
    // إعدادات التطوير
    debug: import.meta.env.VITE_DEBUG === 'true',
    environment: import.meta.env.VITE_ENVIRONMENT || (isDevelopment ? 'development' : 'production'),
    
    // إعدادات التحليلات
    gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
    facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID,
    
    // إعدادات الدفع
    stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    
    // إعدادات البريد الإلكتروني
    emailServiceUrl: import.meta.env.VITE_EMAIL_SERVICE_URL,
    contactEmail: import.meta.env.VITE_CONTACT_EMAIL,
    
    // إعدادات الأداء
    cacheEnabled: import.meta.env.VITE_CACHE_ENABLED === 'true',
    imageOptimization: import.meta.env.VITE_IMAGE_OPTIMIZATION === 'true',
    
    // نوع التخزين
    storageType: (isProduction && import.meta.env.VITE_STORAGE_TYPE === 'api') ? 'api' : 'localStorage'
  };
};

/**
 * إعدادات Vercel المحددة
 */
export const vercelConfig = {
  // إعدادات البناء
  build: {
    outputDirectory: 'dist',
    buildCommand: 'npm run build'
  },
    // متغيرات البيئة المطلوبة للإنتاج
  environmentVariables: {    // متغيرات مطلوبة
    VITE_GEMINI_API_KEY: 'your-gemini-api-key',
    VITE_STORE_NAME: 'Jeancro',
    VITE_DEFAULT_LANGUAGE: 'AR',
    VITE_STORE_CURRENCY: 'MAD',
    VITE_STORE_CURRENCY_SYMBOL: 'د.م',
    
    // متغيرات اختيارية
    VITE_GA_TRACKING_ID: 'optional-google-analytics-id',
    VITE_STRIPE_PUBLIC_KEY: 'optional-stripe-public-key',
    VITE_CONTACT_EMAIL: 'support@jeancro.com'
  },
  
  // إعدادات النشر
  deployment: {
    regions: ['iad1'], // أقرب منطقة للشرق الأوسط
    framework: 'vite'
  }
};

/**
 * فحص البيئة والإعدادات
 */
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = getEnvironmentConfig();
  
  // فحص متغيرات البيئة المطلوبة
  if (config.isProduction && !config.geminiApiKey) {
    errors.push('VITE_GEMINI_API_KEY مطلوب في بيئة الإنتاج');
  }
  
  if (!config.storeName) {
    errors.push('VITE_STORE_NAME مطلوب');
  }
  
  if (!config.defaultLanguage) {
    errors.push('VITE_DEFAULT_LANGUAGE مطلوب');
  }
  
  // فحص صحة عناوين URL
  try {
    new URL(config.apiUrl);
    new URL(config.baseUrl);
    new URL(config.backendUrl);
  } catch {
    errors.push('عناوين URL غير صحيحة في إعدادات البيئة');
  }
  
  // فحص إعدادات التخزين
  if (config.storageType === 'api' && !config.apiUrl) {
    errors.push('API URL مطلوب عند استخدام API storage');
  }
  
  // تحذيرات للإعدادات الاختيارية في الإنتاج
  if (config.isProduction) {
    if (!config.gaTrackingId) {
      console.warn('تحذير: Google Analytics ID غير محدد للإنتاج');
    }
    
    if (!config.contactEmail) {
      console.warn('تحذير: بريد الاتصال غير محدد');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * طباعة معلومات البيئة للتطوير
 */
export const logEnvironmentInfo = (): void => {
  const config = getEnvironmentConfig();
  
  if (config.debug && config.isDevelopment) {
    console.group('🔧 معلومات البيئة');
    console.log('البيئة:', config.environment);
    console.log('اسم المتجر:', config.storeName);
    console.log('اللغة الافتراضية:', config.defaultLanguage);
    console.log('العملة:', `${config.storeCurrency} (${config.currencySymbol})`);
    console.log('نوع التخزين:', config.storageType);
    console.log('التخزين المؤقت:', config.cacheEnabled ? 'مفعل' : 'معطل');
    console.log('تحسين الصور:', config.imageOptimization ? 'مفعل' : 'معطل');
    console.log('مفتاح Gemini API:', config.geminiApiKey ? '✅ موجود' : '❌ مفقود');
    console.groupEnd();
  }
};

export default getEnvironmentConfig;
