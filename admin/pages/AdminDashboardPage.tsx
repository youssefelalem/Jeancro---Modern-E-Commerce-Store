/**
 * صفحة لوحة التحكم الرئيسية
 * تعرض إحصائيات سريعة عن المتجر
 */

import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminPageTitle, Card } from '../../components';

export const AdminDashboardPage: React.FC = () => {
  const { products, categories, ads, t } = useAppContext();
  
  // بيانات محاكاة للزوار والطلبات
  const simulatedVisitors = 1258;
  const simulatedOrders = 58;

  // إعداد الإحصائيات للعرض
  const stats = [
    { label: t('totalProducts'), value: products.length, icon: '🛍️' },
    { label: t('totalCategories'), value: categories.length, icon: '🏷️' },
    {
      label: t('totalAds'),
      value: ads.filter(ad => ad.isActive).length,
      icon: '📢',
    },
    { label: t('simulatedVisitors'), value: simulatedVisitors, icon: '👥' },
    { label: t('simulatedOrders'), value: simulatedOrders, icon: '📦' },
  ];

  return (
    <div>
      <AdminPageTitle title={t('dashboard')} />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {stats.map(stat => (
          <Card key={stat.label} className='text-center'>
            <div className='text-4xl mb-2'>{stat.icon}</div>
            <h3 className='text-xl font-semibold text-gray-700'>
              {stat.label}
            </h3>
            <p className='text-3xl font-bold text-indigo-600 mt-1'>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
