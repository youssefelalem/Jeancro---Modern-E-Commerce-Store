import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks';
import { Button, LocalizedText } from '../components';

export const ProductDetailsPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, currentLanguage, translations, addToCart, storeSettings, showToast } = useAppContext();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {translations.productNotFound}
          </h1>
          <Button 
            onClick={() => window.history.back()}
            variant="secondary"
          >
            {translations.goBack}
          </Button>
        </div>
      </div>
    );
  }

  // إعداد مصفوفة الصور - دمج الصورة الرئيسية مع الصور الإضافية
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  const handleImageClick = () => {
    setIsFullscreen(true);
  };
  const closeFullscreen = () => {
    setIsFullscreen(false);
  };
  
  // إعادة تعيين موضع التمرير إلى الأعلى عند فتح صفحة التفاصيل
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* شريط التنقل (Breadcrumb) */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              {translations.home || 'Home'}
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-sm font-medium text-gray-500">
                <LocalizedText value={product.name} lang={currentLanguage} />
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* وضع عرض الصورة بحجم كامل الشاشة */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeFullscreen}>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button 
              className="absolute top-4 right-4 text-white text-xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
              onClick={closeFullscreen}
            >
              ×
            </button>            <img 
              src={allImages[activeImage]} 
              className="max-w-full max-h-full object-contain"
              alt={product.name[currentLanguage]}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
                >
                  &#10094;
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* قسم الصور */}
        <div className="space-y-4">
          {/* الصورة الرئيسية */}          <div className="relative overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-all cursor-zoom-in" onClick={handleImageClick}>
            <img 
              src={allImages[activeImage]} 
              className="w-full h-[500px] object-contain rounded-lg"
              alt={product.name[currentLanguage]}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all"></div>
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  &#10094;
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>

          {/* المعرض المصغر */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative border-2 rounded-lg overflow-hidden aspect-square ${
                    activeImage === idx 
                      ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover"
                    alt={`${product.name[currentLanguage]} - ${idx + 1}`}
                  />
                  {activeImage === idx && (
                    <div className="absolute inset-0 bg-indigo-500/10"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>        {/* قسم التفاصيل */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <LocalizedText value={product.name} lang={currentLanguage} />
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-3xl font-bold text-indigo-600">
                {storeSettings.currencySymbol}{product.price.toFixed(2)}
              </p>              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {translations.inStock}
              </span>
            </div>
          </div>

          <div className="prose max-w-none">            <h3 className="text-lg font-semibold mb-2">
              {translations.description}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              <LocalizedText 
                value={product.description} 
                lang={currentLanguage} 
              />
            </p>
          </div>

          {/* المميزات */}
          {product.details[currentLanguage].features && product.details[currentLanguage].features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {translations.features}
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {product.details[currentLanguage].features.map((feature: string, idx: number) => (
                  <li key={idx} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* المواصفات */}
          {product.details[currentLanguage].specifications && Object.keys(product.details[currentLanguage].specifications).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {translations.specifications}
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.details[currentLanguage].specifications)
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row">
                        <dt className="font-medium text-gray-900 sm:w-24 flex-shrink-0">{key}:</dt>
                        <dd className="text-gray-600 sm:ml-2">{value}</dd>
                      </div>
                    ))
                  }
                </dl>
              </div>
            </div>
          )}

          {/* زر الإضافة إلى السلة */}
          <div className="pt-4 border-t">
            <Button              onClick={() => {
                addToCart(product);
                showToast && showToast(translations.itemAddedToCart, 'success');
              }}
              variant="primary"
              size="lg"
              className="w-full"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13h10M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {translations.addToCart}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};