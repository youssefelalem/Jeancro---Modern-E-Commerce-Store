/**
 * صفحة إدارة الإعلانات والعروض الترويجية
 * تسمح بإضافة وتعديل وحذف الإعلانات
 */

import React from 'react';
import { useAppContext } from '../../hooks';
import { AdminPageTitle, Button, Card } from '../../components';

export const AdminAdsPage: React.FC = () => {
  const { ads, t } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AdminPageTitle title={t('manageAds') || 'إدارة الإعلانات'} />
        <Button variant="primary" size="md">
          {t('add') || 'إضافة جديد'}
        </Button>
      </div>

      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">صفحة إدارة الإعلانات</h3>
          <p className="text-gray-500">
            هذه الصفحة ستحتوي على وظائف إدارة الإعلانات والعروض الترويجية
          </p>
          <p className="text-sm text-gray-400 mt-2">
            عدد الإعلانات الحالية: {ads.length}
          </p>
        </div>
      </Card>
    </div>
  );
};
