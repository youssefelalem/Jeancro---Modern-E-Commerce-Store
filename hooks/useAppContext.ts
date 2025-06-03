/**
 * Hook مخصص للوصول إلى Context
 * يضمن استخدام Context داخل Provider فقط
 */

import { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
