/**
 * مكون التوجيه الرئيسي للتطبيق
 * يحتوي على جميع المسارات والصفحات المختلفة
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from '../hooks';
import { getStoreSettings } from '../utils/storeSettings';

// صفحات المستخدم
import { HomePage, ProductDetailsPage } from '../pages';

// صفحات الإدارة
import { AdminLayout } from '../admin/layouts/AdminLayout';
import { ProtectedAdminRoute } from '../admin/components/ProtectedAdminRoute';
import { 
  AdminDashboardPage, 
  AdminLoginPage, 
  AdminProductsPage, 
  AdminCategoriesPage, 
  AdminSettingsPage,
  AdminAdsPage,
  AdminChatbotPage
} from '../admin/pages';

// مكونات أخرى
import { CartView } from '../components';

export const AppRoutes: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    storeSettings,
    translations,
    currentLanguage,
    isCartOpen, 
    setIsCartOpen 
  } = useAppContext();

  // وظيفة الدفع عبر واتساب
  const handleCheckout = () => {
    // الحصول على الإعدادات الحالية من النظام المركزي
    const currentSettings = getStoreSettings();
    
    const orderText = cartItems
      .map(item => `${item.name[currentLanguage]} x${item.quantity} - ${currentSettings.currencySymbol}${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');
    
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = `${translations.checkoutViaWhatsApp}\n\n${orderText}\n\n${translations.total}: ${currentSettings.currencySymbol}${total.toFixed(2)}`;
    
    const whatsappUrl = `https://wa.me/${currentSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <>
      <Routes>
        {/* المسار الرئيسي - صفحة البداية */}
        <Route path="/" element={<HomePage />} />
          {/* صفحة تفاصيل المنتج */}
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        
        {/* صفحة تسجيل دخول المسؤول */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* مسارات الإدارة المحمية */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Routes>                  {/* لوحة تحكم المسؤول */}
                  <Route path="/" element={<AdminDashboardPage />} />
                  <Route path="/dashboard" element={<AdminDashboardPage />} />
                  
                  {/* صفحة إدارة المنتجات */}
                  <Route path="/products" element={<AdminProductsPage />} />
                  
                  {/* صفحة إدارة الفئات */}
                  <Route path="/categories" element={<AdminCategoriesPage />} />
                  
                  {/* صفحة إعدادات المتجر */}
                  <Route path="/settings" element={<AdminSettingsPage />} />
                  
                  {/* صفحة إدارة الإعلانات */}
                  <Route path="/ads" element={<AdminAdsPage />} />
                  
                  {/* صفحة إدارة Chatbot */}
                  <Route path="/chatbot" element={<AdminChatbotPage />} />
                  
                  {/* إعادة توجيه المسارات غير الموجودة */}
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        {/* إعادة توجيه المسارات غير الموجودة للصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>      {/* مكون عرض سلة التسوق */}
      {isCartOpen && (
        <CartView
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={handleCheckout}
          currencySymbol={storeSettings.currencySymbol}
          translations={translations}
          currentLanguage={currentLanguage}
        />
      )}
    </>
  );
};
