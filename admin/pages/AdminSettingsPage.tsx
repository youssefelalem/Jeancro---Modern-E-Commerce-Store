/**
 * صفحة إعدادات المتجر
 * تسمح بتحديث إعدادات المتجر الأساسية
 */

import React from 'react';
import { useAppContext } from '../../hooks';
import { StoreSettings, LanguageCode } from '../../types';
import { InputField, AdminPageTitle, Button, Card } from '../../components';
import { validateStoreSettings } from '../../utils/storeSettings';

export const AdminSettingsPage: React.FC = () => {
  const {
    storeSettings,
    setStoreSettings,
    t,
    supportedLanguages,
    showToast,
    currentLanguage,
  } = useAppContext();

  const [formData, setFormData] = React.useState<StoreSettings>(storeSettings);
  const [activeTab, setActiveTab] = React.useState<string>('general');
  
  // معالجة تغيير الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // معالجة تغيير روابط التواصل الاجتماعي
  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [platform]: value
      }
    }));
  };

  // معالجة تغيير إعدادات المظهر
  const handleAppearanceChange = (key: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  // معالجة تغيير إعدادات SEO
  const handleSeoChange = (key: string, value: string, lang: LanguageCode = currentLanguage) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: {
          ...prev.seo[key as keyof typeof prev.seo],
          [lang]: value
        }
      }
    }));
  };

  // معالجة تغيير إعدادات الشات بوت
  const handleChatbotChange = (key: string, value: string | boolean, lang?: LanguageCode) => {
    if (key === 'welcomeMessage' && lang) {
      setFormData(prev => ({
        ...prev,
        chatbot: {
          ...prev.chatbot,
          welcomeMessage: {
            ...prev.chatbot.welcomeMessage,
            [lang]: value as string
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        chatbot: {
          ...prev.chatbot,
          [key]: value
        }
      }));
    }
  };

  // معالجة تغيير إعدادات الشحن
  const handleShippingChange = (key: string, value: string | number | string[]) => {
    let processedValue = value;
    if (key === 'freeShippingThreshold' || key === 'shippingCost') {
      processedValue = value === '' ? 0 : Number(value);
    }
    
    if (key === 'shippingMethods' && typeof value === 'string') {
      processedValue = value.split(',').map(method => method.trim());
    }
    
    setFormData(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [key]: processedValue
      }
    }));
  };

  // حفظ الإعدادات
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة الإعدادات
    const validation = validateStoreSettings(formData);
    
    if (!validation.isValid) {
      showToast(validation.errors.join(', '), 'error');
      return;
    }
    
    // حفظ الإعدادات في المخزن المركزي
    setStoreSettings(formData);
    showToast(t('settingsSuccessfullySaved'), 'success');
  };

  // التبديل بين التبويبات
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'seo':
        return renderSeoSettings();
      case 'chatbot':
        return renderChatbotSettings();
      case 'shipping':
        return renderShippingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  // عرض الإعدادات العامة
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">الإعدادات الأساسية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t('storeName')}
          id="storeName"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          required
        />
        
        <InputField
          label={t('defaultLanguage')}
          id="defaultLanguage"
          name="defaultLanguage"
          value={formData.defaultLanguage}
          onChange={handleChange}
          options={supportedLanguages.map(lang => ({
            value: lang,
            label: lang === LanguageCode.EN ? 'English' : 'العربية'
          }))}
          required
        />
        
        <InputField
          label={t('currencySymbol')}
          id="currencySymbol"
          name="currencySymbol"
          value={formData.currencySymbol}
          onChange={handleChange}
          placeholder="د.م"
          required
        />
        
        <InputField
          label={t('whatsappNumber')}
          id="whatsappNumber"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          placeholder="+1234567890"
          required
        />
      </div>

      <h3 className="text-lg font-medium mb-4 mt-6">{t('socialMediaLinks')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label={t('facebook')}
          id="facebook"
          name="facebook"
          value={formData.socialMediaLinks.facebook || ''}
          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
          placeholder="https://facebook.com/store"
        />
        
        <InputField
          label={t('instagram')}
          id="instagram"
          name="instagram"
          value={formData.socialMediaLinks.instagram || ''}
          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
          placeholder="https://instagram.com/store"
        />
        
        <InputField
          label={t('twitter')}
          id="twitter"
          name="twitter"
          value={formData.socialMediaLinks.twitter || ''}
          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
          placeholder="https://twitter.com/store"
        />
      </div>
    </div>
  );

  // عرض إعدادات المظهر
  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">إعدادات المظهر</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="اللون الأساسي"
          id="primaryColor"
          name="primaryColor"
          type="color"
          value={formData.appearance.primaryColor}
          onChange={(e) => handleAppearanceChange('primaryColor', e.target.value)}
          required
        />
        
        <InputField
          label="لون الإبراز"
          id="accentColor"
          name="accentColor"
          type="color"
          value={formData.appearance.accentColor}
          onChange={(e) => handleAppearanceChange('accentColor', e.target.value)}
          required
        />
        
        <InputField
          label="مسار الشعار"
          id="logo"
          name="logo"
          value={formData.appearance.logo || ''}
          onChange={(e) => handleAppearanceChange('logo', e.target.value)}
          placeholder="/assets/img/logo.png"
        />
        
        <InputField
          label="مسار صورة البانر"
          id="bannerImage"
          name="bannerImage"
          value={formData.appearance.bannerImage || ''}
          onChange={(e) => handleAppearanceChange('bannerImage', e.target.value)}
          placeholder="/assets/img/banner.jpg"
        />
        
        <div className="col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.appearance.darkMode}
              onChange={(e) => handleAppearanceChange('darkMode', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>تفعيل الوضع الداكن</span>
          </label>
        </div>
      </div>
    </div>
  );

  // عرض إعدادات SEO
  const renderSeoSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">إعدادات محركات البحث</h3>
      
      {supportedLanguages.map(lang => (
        <div key={lang} className="p-4 border rounded-lg mb-4">
          <h4 className="font-medium mb-3">
            {lang === LanguageCode.EN ? 'English' : 'العربية'}
          </h4>
          <div className="space-y-4">
            <InputField
              label="عنوان الصفحة"
              id={`metaTitle-${lang}`}
              name={`metaTitle-${lang}`}
              value={formData.seo.metaTitle[lang]}
              onChange={(e) => handleSeoChange('metaTitle', e.target.value, lang)}
              required
            />
            
            <InputField
              label="وصف الصفحة"
              id={`metaDescription-${lang}`}
              name={`metaDescription-${lang}`}
              value={formData.seo.metaDescription[lang]}
              onChange={(e) => handleSeoChange('metaDescription', e.target.value, lang)}
              multiline
              required
            />
            
            <InputField
              label="الكلمات المفتاحية"
              id={`keywords-${lang}`}
              name={`keywords-${lang}`}
              value={formData.seo.keywords[lang]}
              onChange={(e) => handleSeoChange('keywords', e.target.value, lang)}
              placeholder="كلمات,مفصولة,بفواصل"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );

  // عرض إعدادات الشات بوت
  const renderChatbotSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">إعدادات الشات بوت</h3>
      
      <div className="flex items-center space-x-2 mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.chatbot.enabled}
            onChange={(e) => handleChatbotChange('enabled', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>تفعيل الشات بوت</span>
        </label>
      </div>
      
      <div className="flex items-center space-x-2 mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.chatbot.autoShowOnPage}
            onChange={(e) => handleChatbotChange('autoShowOnPage', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>عرض الشات بوت تلقائياً عند تحميل الصفحة</span>
        </label>
      </div>
      
      <h4 className="font-medium mb-3">رسالة الترحيب</h4>
      {supportedLanguages.map(lang => (
        <div key={lang} className="mb-4">
          <InputField
            label={lang === LanguageCode.EN ? 'English' : 'العربية'}
            id={`welcomeMessage-${lang}`}
            name={`welcomeMessage-${lang}`}
            value={formData.chatbot.welcomeMessage[lang]}
            onChange={(e) => handleChatbotChange('welcomeMessage', e.target.value, lang)}
            multiline
            required
          />
        </div>
      ))}
    </div>
  );

  // عرض إعدادات الشحن
  const renderShippingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">إعدادات الشحن</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="تكلفة الشحن"
          id="shippingCost"
          name="shippingCost"
          type="number"
          value={formData.shipping.shippingCost.toString()}
          onChange={(e) => handleShippingChange('shippingCost', e.target.value)}
          required
        />
        
        <InputField
          label="حد الشحن المجاني"
          id="freeShippingThreshold"
          name="freeShippingThreshold"
          type="number"
          value={formData.shipping.freeShippingThreshold?.toString() || ''}
          onChange={(e) => handleShippingChange('freeShippingThreshold', e.target.value)}
          helperText="اترك فارغًا إذا كنت لا ترغب في تقديم شحن مجاني"
        />
        
        <div className="col-span-2">
          <InputField
            label="طرق الشحن المتاحة"
            id="shippingMethods"
            name="shippingMethods"
            value={Array.isArray(formData.shipping.shippingMethods) ? formData.shipping.shippingMethods.join(', ') : ''}
            onChange={(e) => handleShippingChange('shippingMethods', e.target.value)}
            helperText="أدخل طرق الشحن مفصولة بفواصل"
            multiline
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <AdminPageTitle title={t('storeSettings')} />
      
      <Card>
        <div className="border-b mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              عام
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appearance'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المظهر
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seo'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chatbot'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الشات بوت
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shipping'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الشحن
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderTabContent()}
          
          {/* زر الحفظ */}
          <div className="flex justify-end pt-4 mt-6 border-t">
            <Button type="submit" variant="primary" size="md">
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
