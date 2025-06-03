/**
 * تخطيط صفحات الإدارة
 * يوفر تصميم موحد لجميع صفحات لوحة التحكم
 */

import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { LanguageCode } from '../../types';
import { AdminSidebar } from '../../components';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentLanguage, logoutAdmin, translations } = useAppContext();
  const navigate = useNavigate();

  /**
   * معالج تسجيل الخروج
   */
  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  return (
    <div
      className={`flex h-screen bg-gray-100 ${currentLanguage === LanguageCode.AR ? 'flex-row-reverse' : ''}`}
    >
      <AdminSidebar
        translations={translations}
        currentLanguage={currentLanguage}
        onLogout={handleLogout}
      />
      <main
        className={`flex-1 p-8 overflow-y-auto ${currentLanguage === LanguageCode.AR ? 'mr-64' : 'ml-64'}`}
      >
        {children}
      </main>
    </div>
  );
};
