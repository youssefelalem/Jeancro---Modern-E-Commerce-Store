/**
 * مساعدات لإدارة متغيرات البيئة
 */

import { getEnvironmentConfig, validateEnvironment, logEnvironmentInfo } from './environment';

/**
 * التحقق من صحة إعدادات البيئة عند بدء التطبيق
 */
export const initializeEnvironment = (): boolean => {
  const validation = validateEnvironment();
  const config = getEnvironmentConfig();
  
  // طباعة معلومات البيئة في التطوير
  logEnvironmentInfo();
  
  if (!validation.isValid) {
    console.error('❌ أخطاء في إعدادات البيئة:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }
  
  if (config.isDevelopment) {
    console.log('✅ إعدادات البيئة صحيحة');
  }
  
  return true;
};

/**
 * الحصول على متغير بيئة مع قيمة افتراضية
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

/**
 * الحصول على متغير بيئة كقيمة منطقية
 */
export const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
};

/**
 * التحقق من وجود متغير بيئة مطلوب
 */
export const requireEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`متغير البيئة المطلوب ${key} غير موجود`);
  }
  return value;
};

/**
 * الحصول على معلومات البيئة المختصرة
 */
export const getEnvironmentSummary = () => {
  const config = getEnvironmentConfig();
  
  return {
    environment: config.environment,
    isProduction: config.isProduction,
    isDevelopment: config.isDevelopment,
    hasGeminiKey: !!config.geminiApiKey,
    storeName: config.storeName,
    defaultLanguage: config.defaultLanguage,
    currency: config.storeCurrency,
    storageType: config.storageType,
    debug: config.debug
  };
};

/**
 * تصدير الثوابت المهمة
 */
export const ENV_KEYS = {
  // مطلوبة
  GEMINI_API_KEY: 'VITE_GEMINI_API_KEY',
  STORE_NAME: 'VITE_STORE_NAME',
  DEFAULT_LANGUAGE: 'VITE_DEFAULT_LANGUAGE',
  
  // اختيارية
  GA_TRACKING_ID: 'VITE_GA_TRACKING_ID',
  STRIPE_PUBLIC_KEY: 'VITE_STRIPE_PUBLIC_KEY',
  DEBUG: 'VITE_DEBUG'
} as const;

/**
 * فحص متغيرات البيئة المطلوبة بسرعة
 */
export const checkRequiredEnvironmentVariables = (): { 
  missing: string[]; 
  present: string[]; 
  isValid: boolean; 
} => {
  const required = [
    ENV_KEYS.GEMINI_API_KEY,
    ENV_KEYS.STORE_NAME,
    ENV_KEYS.DEFAULT_LANGUAGE
  ];
  
  const missing: string[] = [];
  const present: string[] = [];
  
  required.forEach(key => {
    if (import.meta.env[key]) {
      present.push(key);
    } else {
      missing.push(key);
    }
  });
  
  return {
    missing,
    present,
    isValid: missing.length === 0
  };
};

export default {
  initializeEnvironment,
  getEnvVar,
  getEnvBoolean,
  requireEnvVar,
  getEnvironmentSummary,
  checkRequiredEnvironmentVariables,
  ENV_KEYS
};
