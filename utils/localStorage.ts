/**
 * وظائف مساعدة لإدارة localStorage
 */

/**
 * حفظ البيانات في localStorage مع معالجة الأخطاء
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key "${key}":`, error);
  }
};

/**
 * استرجاع البيانات من localStorage مع معالجة الأخطاء
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * حذف عنصر من localStorage
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key "${key}":`, error);
  }
};

/**
 * التحقق من وجود عنصر في localStorage
 */
export const existsInLocalStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage for key "${key}":`, error);
    return false;
  }
};
