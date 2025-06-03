/**
 * إعدادات بيئة التطوير والإنتاج
 */

interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  apiUrl: string;
  geminiApiKey: string;
  storageType: 'localStorage' | 'api';
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
    apiUrl: isProduction 
      ? 'https://your-domain.vercel.app/api' 
      : 'http://localhost:5173/api',
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    storageType: isProduction && false ? 'api' : 'localStorage' // سيتم تغييرها لاحقاً
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
  
  // متغيرات البيئة المطلوبة
  environmentVariables: {
    VITE_GEMINI_API_KEY: 'your-gemini-api-key'
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
  
  // فحص إعدادات التخزين
  if (config.storageType === 'api' && !config.apiUrl) {
    errors.push('API URL مطلوب عند استخدام API storage');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default getEnvironmentConfig;
