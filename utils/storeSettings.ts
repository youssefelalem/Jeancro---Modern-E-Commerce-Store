/**
 * ملف إعدادات المتجر المركزية
 * يتم استخدامه لإدارة إعدادات المتجر المشتركة بين جميع المستخدمين
 */

import { StoreSettings, LanguageCode } from '../types';
import { INITIAL_STORE_SETTINGS } from '../constants';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';

// اسم مفتاح التخزين للإعدادات
const STORE_SETTINGS_KEY = 'jeancro-global-settings';

/**
 * الحصول على إعدادات المتجر الحالية
 * تحميل الإعدادات من التخزين المحلي أو استخدام القيم الافتراضية
 */
export const getStoreSettings = (): StoreSettings => {
  // محاولة تحميل الإعدادات من التخزين المحلي
  const storedSettings = loadFromLocalStorage<StoreSettings | undefined>(STORE_SETTINGS_KEY, undefined);
  
  // استخدام الإعدادات المخزنة أو القيم الافتراضية
  return storedSettings || INITIAL_STORE_SETTINGS;
};

/**
 * حفظ إعدادات المتجر
 * يتم استدعاء هذه الوظيفة عند تحديث الإعدادات من لوحة الإدارة
 */
export const saveStoreSettings = (settings: StoreSettings): void => {
  // حفظ الإعدادات في التخزين المحلي
  saveToLocalStorage(STORE_SETTINGS_KEY, settings);
};

/**
 * إعادة ضبط إعدادات المتجر إلى القيم الافتراضية
 * مفيدة للاختبار أو في حالة حدوث مشاكل
 */
export const resetStoreSettings = (): StoreSettings => {
  saveToLocalStorage(STORE_SETTINGS_KEY, INITIAL_STORE_SETTINGS);
  return INITIAL_STORE_SETTINGS;
};

/**
 * تحديث جزء من إعدادات المتجر
 * تسمح بتحديث إعداد واحد فقط بدلاً من الإعدادات بأكملها
 */
export const updateStoreSettings = (partialSettings: Partial<StoreSettings>): StoreSettings => {
  const currentSettings = getStoreSettings();
  const updatedSettings = { ...currentSettings, ...partialSettings };
  saveStoreSettings(updatedSettings);
  return updatedSettings;
};

/**
 * التحقق من صحة إعدادات المتجر
 * تأكد من أن جميع الحقول المطلوبة موجودة وصحيحة
 */
export const validateStoreSettings = (settings: StoreSettings): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // التحقق من وجود الحقول المطلوبة
  if (!settings.storeName) {
    errors.push('اسم المتجر مطلوب');
  }

  if (!settings.defaultLanguage) {
    errors.push('اللغة الافتراضية مطلوبة');
  }

  if (!settings.currencySymbol) {
    errors.push('رمز العملة مطلوب');
  }

  if (!settings.whatsappNumber) {
    errors.push('رقم واتساب مطلوب');
  }

  // التحقق من إعدادات المظهر
  if (!settings.appearance?.primaryColor) {
    errors.push('اللون الأساسي مطلوب');
  }

  if (!settings.appearance?.accentColor) {
    errors.push('لون الإبراز مطلوب');
  }
  // التحقق من إعدادات SEO
  const languages = Object.values(LanguageCode);
  languages.forEach((lang) => {
    if (!settings.seo?.metaTitle?.[lang as LanguageCode]) {
      errors.push(`عنوان الصفحة باللغة ${lang === 'EN' ? 'الإنجليزية' : 'العربية'} مطلوب`);
    }
    if (!settings.seo?.metaDescription?.[lang as LanguageCode]) {
      errors.push(`وصف الصفحة باللغة ${lang === 'EN' ? 'الإنجليزية' : 'العربية'} مطلوب`);
    }
  });

  // التحقق من إعدادات الشات بوت
  languages.forEach((lang) => {
    if (settings.chatbot?.enabled && !settings.chatbot?.welcomeMessage?.[lang as LanguageCode]) {
      errors.push(`رسالة الترحيب للشات بوت باللغة ${lang === 'EN' ? 'الإنجليزية' : 'العربية'} مطلوبة`);
    }
  });

  // التحقق من إعدادات الشحن
  if (typeof settings.shipping?.shippingCost !== 'number') {
    errors.push('تكلفة الشحن مطلوبة وتكون رقمية');
  }

  if (!Array.isArray(settings.shipping?.shippingMethods) || settings.shipping.shippingMethods.length === 0) {
    errors.push('يجب تحديد طريقة شحن واحدة على الأقل');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// تصدير وظائف إضافية مفيدة
export default {
  getStoreSettings,
  saveStoreSettings,
  resetStoreSettings,
  updateStoreSettings,
  validateStoreSettings
};
