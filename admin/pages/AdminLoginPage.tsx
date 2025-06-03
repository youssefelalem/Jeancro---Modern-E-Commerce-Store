/**
 * صفحة تسجيل دخول المسؤول
 * واجهة بسيطة لتسجيل دخول المسؤول باستخدام كلمة مرور
 * - التحقق من كلمة المرور
 * - إعادة التوجيه إلى لوحة التحكم عند النجاح
 * - عرض رسائل الخطأ عند الفشل
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminLoginForm } from '../../components';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, isAdminLoggedIn, t, translations } = useAppContext();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // إعادة توجيه المسؤول المسجل الدخول إلى لوحة التحكم
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleLogin = (password: string) => {
    if (loginAdmin(password)) {
      navigate('/admin/dashboard');
    } else {
      setError(t('loginFailed'));
    }
  };

  return (
    <AdminLoginForm
      onLogin={handleLogin}
      error={error}
      translations={translations}
    />
  );
};
