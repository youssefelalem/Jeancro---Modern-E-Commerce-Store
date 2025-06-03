/**
 * مكون حماية مسارات الإدارة
 * يتحقق من تسجيل دخول المسؤول قبل السماح بالوصول لصفحات الإدارة
 * - إذا لم يكن مسجل دخول، يُعيد توجيه لصفحة تسجيل الدخول
 * - إذا كان مسجل دخول، يعرض المحتوى داخل تخطيط الإدارة
 */

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminLayout } from '../layouts/AdminLayout';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const { isAdminLoggedIn } = useAppContext();
  
  if (!isAdminLoggedIn) {
    return <Navigate to='/admin/login' replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};
