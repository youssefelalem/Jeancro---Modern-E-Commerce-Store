/**
 * صفحة إعدادات المتجر
 * تسمح بتحديث إعدادات المتجر الأساسية
 */

import React from 'react';
import { useAppContext } from '../../hooks';
import { StoreSettings, LanguageCode } from '../../types';
import { InputField, AdminPageTitle, Button, Card } from '../../components';

export const AdminSettingsPage: React.FC = () => {  const {
    storeSettings,
    setStoreSettings,
    t,
    supportedLanguages,
    showToast,
  } = useAppContext();

  const [formData, setFormData] = React.useState<StoreSettings>(storeSettings);
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

  // حفظ الإعدادات
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeName || !formData.currencySymbol || !formData.whatsappNumber) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    setStoreSettings(formData);
    showToast(t('settingsSuccessfullySaved'), 'success');
  };

  return (
    <div className="space-y-6">
      <AdminPageTitle title={t('storeSettings')} />
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* إعدادات أساسية */}
          <div>
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
                placeholder="mad "
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
          </div>

          {/* روابط التواصل الاجتماعي */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('socialMediaLinks')}</h3>
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

          {/* زر الحفظ */}
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" size="md">
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
