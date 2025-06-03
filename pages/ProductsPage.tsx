/**
 * صفحة عرض جميع المنتجات مع Pagination محسن
 * ميزات إضافية: ترتيب حسب السعر، عرض شبكة/قائمة، إحصائيات
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Product, LanguageCode } from '../types';
import { ProductCard, Button, LocalizedText } from '../components';

type SortOption = 'name' | 'price-low' | 'price-high' | 'newest';
type ViewMode = 'grid' | 'list';

export const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    addToCart,
    currentLanguage,
    t,
    storeSettings,
    translations,
    showToast,
  } = useAppContext();

  // حالات الصفحة
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const ITEMS_PER_PAGE = 12;

  // فلترة وترتيب المنتجات
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // فلترة حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          (p.name[currentLanguage] || p.name[LanguageCode.EN])
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (p.description[currentLanguage] || p.description[LanguageCode.EN])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // فلترة حسب السعر
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    // ترتيب المنتجات
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => {
          const nameA = a.name[currentLanguage] || a.name[LanguageCode.EN];
          const nameB = b.name[currentLanguage] || b.name[LanguageCode.EN];
          return nameA.localeCompare(nameB);
        });
        break;
      case 'newest':
        // افتراض أن المنتجات الجديدة لها id أكبر
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, minPrice, maxPrice, currentLanguage]);

  // حساب الـ pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(t('itemAddedToCart'), 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* عنوان الصفحة */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('ourProducts')}
          </h1>
          <p className="text-gray-600">
            {t('exploreOurCollection')} - {filteredAndSortedProducts.length} {t('productsFound')}
          </p>
        </div>

        {/* شريط الفلاتر والبحث */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* البحث */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('searchProducts')}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('category')}
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">{t('allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    <LocalizedText value={cat.name} lang={currentLanguage} />
                  </option>
                ))}
              </select>
            </div>

            {/* الترتيب */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="name">{t('name')}</option>
                <option value="price-low">{t('priceLowToHigh')}</option>
                <option value="price-high">{t('priceHighToLow')}</option>
                <option value="newest">{t('newest')}</option>
              </select>
            </div>

            {/* السعر الأدنى */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('minPrice')}
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* السعر الأعلى */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('maxPrice')}
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <Button onClick={resetFilters} variant="outline" size="sm">
                {t('resetFilters')}
              </Button>
              {/* تبديل وضع العرض */}
              <div className="flex rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  شبكة
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'list'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  قائمة
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {t('showing')} {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedProducts.length)} {t('of')} {filteredAndSortedProducts.length}
            </div>
          </div>
        </div>

        {/* عرض المنتجات */}
        {currentProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {currentProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                currencySymbol={storeSettings.currencySymbol}
                translations={translations}
                currentLanguage={currentLanguage}
                onViewDetails={() => {}} // يمكن إضافة modal هنا
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('noProductsFound')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('tryDifferentFilters')}
            </p>
            <Button onClick={resetFilters} variant="primary">
              {t('resetFilters')}
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              {t('previous')}
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              {t('next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
