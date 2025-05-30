import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from './App';
import { Button, LocalizedText } from './components';

export const ProductDetailsPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { productId } = useParams<{ productId: string }>();
  const { products, currentLanguage, translations, addToCart, storeSettings } = useAppContext();
  
  const product = products.find(p => p.id === productId);
  
  if (!product) return <div>Product not found</div>;

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* وضع عرض الصورة بحجم كامل الشاشة */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeFullscreen}>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button 
              className="absolute top-4 right-4 text-white text-xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
              onClick={closeFullscreen}
            >
              ×
            </button>
            <img 
              src={product.imageUrl || product.images[activeImage]} 
              className="max-w-full max-h-full object-contain"
              alt={product.name[currentLanguage]}
            />
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
                >
                  &#10094;
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0));
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
          {/* الصورة الرئيسية */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-all cursor-zoom-in" onClick={handleImageClick}>
            <img 
              src={product.images[activeImage]} 
              className="w-full h-[500px] object-contain rounded-lg"
              alt={product.name[currentLanguage]}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all"></div>
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  &#10094;
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>

          {/* المعرض المصغر */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {product.images.map((img: string, idx: number) => (
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
        </div>

        {/* قسم التفاصيل */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">
            <LocalizedText value={product.name} lang={currentLanguage} />
          </h1>
            <p className="text-xl font-bold text-indigo-600">
            {storeSettings.currencySymbol}{product.price}
          </p>

          <div className="prose max-w-none">
            <LocalizedText 
              value={product.description} 
              lang={currentLanguage} 
            />
          </div>

          {/* المميزات */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {translations.features}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {product.details[currentLanguage].features.map((feature: string, idx: number) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* المواصفات */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {translations.specifications}
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              {Object.entries(product.details[currentLanguage].specifications)
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium">{key}</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))
              }
            </dl>
          </div>

          {/* زر الإضافة إلى السلة */}
          <Button 
            onClick={() => addToCart(product)}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {translations.addToCart}
          </Button>
        </div>
      </div>
    </div>
  );
};