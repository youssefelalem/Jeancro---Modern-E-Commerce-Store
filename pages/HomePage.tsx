/**
 * صفحة البداية الرئيسية للمتجر
 * تحتوي على:
 * - عرض المنتجات في شبكة
 * - فلترة المنتجات حسب الفئة والسعر
 * - البحث في المنتجات
 * - عرض الإعلانات
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks';
import { Product, LanguageCode } from '../types';
import {
  AdBanner,
  Button,
  LocalizedText,
  ProductCard,
} from '../components';
import { getStoreSettings } from '../utils/storeSettings';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    categories,
    ads,
    addToCart,
    currentLanguage,
    t,
    translations,
    showToast,
  } = useAppContext();
  
  // الحصول على الإعدادات المحدثة من النظام المركزي
  const storeSettings = getStoreSettings();
  
  // حالات الفلترة والبحث
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // تحديث المنتجات المفلترة عند تغيير المنتجات
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  /**
   * دالة فلترة المنتجات حسب المعايير المختلفة
   */
  const handleFilter = useCallback(() => {
    let tempProducts = [...products];
    
    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(
        p => p.categoryId === selectedCategory
      );
    }
    
    // فلترة حسب البحث
    if (searchTerm) {
      tempProducts = tempProducts.filter(
        p =>
          (p.name[currentLanguage] || p.name[LanguageCode.EN])
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (p.description[currentLanguage] || p.description[LanguageCode.EN])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    
    // فلترة حسب السعر الأدنى
    if (minPrice) {
      tempProducts = tempProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    
    // فلترة حسب السعر الأعلى
    if (maxPrice) {
      tempProducts = tempProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    setFilteredProducts(tempProducts);
  }, [products, selectedCategory, searchTerm, minPrice, maxPrice, currentLanguage]);

  // تطبيق الفلترة عند تغيير أي من المعايير
  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  /**
   * إعادة تعيين جميع الفلاتر
   */
  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(products);
  };

  // تجهيز الإعلانات للعرض
  const activeAds = ads.filter(ad => ad.isActive);
  const homepageBannerAd = activeAds.find(ad => ad.placement === 'homepage-banner');
  const sidebarAds = activeAds.filter(ad => ad.placement === 'sidebar');
  
  /**
   * التنقل إلى صفحة تفاصيل المنتج
   */ /**
   * التنقل إلى صفحة تفاصيل المنتج
   */
  const handleViewDetails = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {homepageBannerAd && (
        <div className='mb-8'>
          <AdBanner
            ad={homepageBannerAd}
            currentLanguage={currentLanguage}
            translations={translations}
          />
        </div>
      )}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <aside className='lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>
              {t('filterByCategory')}
            </h2>
            <div className='mb-6'>
              <label
                htmlFor='search'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                {t('search')}
              </label>
              <input
                type='text'
                id='search'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('searchProducts')}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                {t('category')}
              </label>
              <select
                id='category'
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white'
              >
                <option value='all'>{t('allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    <LocalizedText value={cat.name} lang={currentLanguage} />
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-700 mb-1'>
                {t('priceRange')}
              </h3>
              <div className='flex space-x-2'>
                <input
                  type='number'
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder={t('minPrice')}
                  className='w-1/2 p-2 border border-gray-300 rounded-md'
                />
                <input
                  type='number'
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder={t('maxPrice')}
                  className='w-1/2 p-2 border border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <Button onClick={handleFilter} variant='primary'>
                {t('applyFilters')}
              </Button>
              <Button onClick={resetFilters} variant='outline'>
                {t('resetFilters')}
              </Button>
            </div>

            {sidebarAds.length > 0 && (
              <div className='mt-8'>
                <h3 className='text-lg font-semibold mb-3 text-gray-700'>
                  {t('internalAds')}
                </h3>
                {sidebarAds.map(ad => (
                  <AdBanner
                    key={ad.id}
                    ad={ad}
                    currentLanguage={currentLanguage}
                    translations={translations}
                  />
                ))}
              </div>
            )}
            {sidebarAds.length === 0 && (
              <div className='mt-8 text-sm text-gray-500'>
                {t('noAdsAvailable')}
              </div>
            )}
          </aside>

          {/* Products Grid */}
          <main className='lg:col-span-3'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>
              {t('ourProducts')}
            </h1>
            {filteredProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={p => {
                      addToCart(p);
                      showToast(t('itemAddedToCart'), 'success');
                    }}
                    currencySymbol={storeSettings.currencySymbol}
                    translations={translations}
                    currentLanguage={currentLanguage}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-10'>
                <p className='text-xl text-gray-600'>{t('noProductsFound')}</p>
              </div>
            )}
          </main>        </div>
      </div>
    </div>
  );
};
