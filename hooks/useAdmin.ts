/**
 * Hook مخصص لإدارة وظائف المسؤول
 * يقدم واجهة مبسطة للتعامل مع عمليات الإدارة
 */

import { useAppContext } from './useAppContext';

export const useAdmin = () => {
  const {
    isAdminLoggedIn,
    loginAdmin: contextLoginAdmin,
    logoutAdmin: contextLogoutAdmin,
    showToast,
    t,
  } = useAppContext();
  // تسجيل دخول المسؤول مع معالجة النتائج
  const loginAdmin = (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const success = contextLoginAdmin(password);
      if (success) {
        showToast(t('adminLogin'), 'success');
        resolve(true);
      } else {
        showToast(t('loginFailed'), 'error');
        resolve(false);
      }
    });
  };
  // تسجيل خروج المسؤول مع إشعار
  const logoutAdmin = () => {
    contextLogoutAdmin();
    showToast(t('logout'), 'info');
  };

  // التحقق من صلاحيات المسؤول
  const hasAdminAccess = (): boolean => {
    return isAdminLoggedIn;
  };
  // دالة للتحقق من إمكانية الوصول لصفحة إدارية
  const canAccessAdminPage = (): boolean => {
    // يمكن إضافة منطق أكثر تعقيداً هنا للتحكم في الصلاحيات
    // حسب نوع الصفحة أو المستخدم
    return isAdminLoggedIn;
  };

  return {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    hasAdminAccess,
    canAccessAdminPage,
  };
};
