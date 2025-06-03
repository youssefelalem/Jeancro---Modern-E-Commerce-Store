/**
 * دالة مساعدة لتوليد معرفات فريدة
 * تستخدم في إنشاء IDs للمنتجات والفئات والإعلانات
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
