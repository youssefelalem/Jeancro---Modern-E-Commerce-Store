/**
 * اختبار البنية الجديدة - مع Menu وFooter مكتملين
 * للتأكد من أن جميع المكونات تعمل بشكل صحيح مع تجربة مطابقة للأصل
 */

import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import { AppRoutes } from './routes/AppRoutes';
import { useAppContext } from './hooks';
import { Navbar, Footer, ChatbotWidget, Toast } from './components';
import { SUPPORTED_LANGUAGES } from './constants';
import { getStoreSettings } from './utils/storeSettings';

/**
 * مكون التطبيق الداخلي - يحتوي على العناصر التي تحتاج Context
 */
const TestAppContent: React.FC = () => {
  const location = useLocation();  const {
    products,
    cartItems,
    currentLanguage,
    setCurrentLanguage,
    translations,
    isAdminLoggedIn,
    logoutAdmin,
    setIsCartOpen,
    isChatbotOpen,
    toggleChatbot,    chatMessages,
    sendChatMessage,
    clearChatMessages,
    isChatLoading,
    faqs,
    toast,
    setToast,
    addToCart,
  } = useAppContext();

  // حساب عدد العناصر في السلة
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // التحقق من كون المسار الحالي صفحة إدارة
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // الحصول على الإعدادات المحدثة من النظام المركزي
  const currentStoreSettings = getStoreSettings();

  return (
    <div 
      className={`flex flex-col min-h-screen ${currentLanguage === 'AR' ? 'rtl' : 'ltr'}`}
      dir={currentLanguage === 'AR' ? 'rtl' : 'ltr'}
    >
      {/* شريط التنقل العلوي - يظهر فقط في الصفحات العادية وليس في صفحات الإدارة */}
      {!isAdminPage && (
        <Navbar
          storeName={currentStoreSettings.storeName}
          cartItemCount={cartItemCount}
          currentLanguage={currentLanguage}
          supportedLanguages={SUPPORTED_LANGUAGES}
          onLanguageChange={setCurrentLanguage}
          onCartClick={() => setIsCartOpen(true)}
          translations={translations}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={isAdminLoggedIn ? logoutAdmin : undefined}
        />
      )}

      {/* محتوى التطبيق - المسارات والصفحات */}
      <div className="flex-grow">
        <AppRoutes />
      </div>      {/* تذييل الصفحة - يظهر فقط في الصفحات العادية وليس في صفحات الإدارة */}
      {!isAdminPage && (
        <Footer
          storeName={currentStoreSettings.storeName}
          translations={translations}
          settings={currentStoreSettings}
          currentLanguage={currentLanguage}
        />
      )}      {/* Chatbot Widget - يظهر فقط في الصفحات العادية وليس في صفحات الإدارة */}
      {!isAdminPage && currentStoreSettings.chatbot.enabled && (        <ChatbotWidget
          isOpen={isChatbotOpen}
          onToggle={toggleChatbot}
          messages={chatMessages}
          onSendMessage={sendChatMessage}
          onStartNewConversation={clearChatMessages}
          faqs={faqs}
          currentLanguage={currentLanguage}
          translations={translations}
          isLoading={isChatLoading}
          onAddToCart={(productId) => {
            const product = products.find(p => p.id === productId);
            if (product) {
              addToCart(product);
            }
          }}
          currencySymbol={currentStoreSettings.currencySymbol}
          storeSettings={currentStoreSettings}
        />
      )}

      {/* إشعارات Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

/**
 * مكون TestApp الرئيسي
 * يحتوي على مزود Context والمسارات مع جميع المكونات المطلوبة
 */
const TestApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <TestAppContent />
      </AppProvider>
    </BrowserRouter>
  );
};

export default TestApp;
