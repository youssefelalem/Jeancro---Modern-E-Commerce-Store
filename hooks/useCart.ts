/**
 * Hook مخصص لإدارة وظائف سلة التسوق
 * يقدم واجهة مبسطة للتعامل مع سلة التسوق
 */

import { useAppContext } from './useAppContext';
import { Product } from '../types';
import { getStoreSettings } from '../utils/storeSettings';

export const useCart = () => {
  const {
    cartItems,
    addToCart: contextAddToCart,
    removeFromCart: contextRemoveFromCart,
    updateCartQuantity: contextUpdateCartQuantity,
    clearCart: contextClearCart,
    t,
    showToast,
  } = useAppContext();
  
  // الحصول على الإعدادات المحدثة من النظام المركزي
  const storeSettings = getStoreSettings();

  // حساب العدد الإجمالي للعناصر في السلة
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // حساب السعر الإجمالي
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // إضافة منتج مع إشعار
  const addToCart = (product: Product) => {
    contextAddToCart(product);
  };

  // إزالة منتج مع إشعار
  const removeFromCart = (productId: string) => {
    contextRemoveFromCart(productId);
  };

  // تحديث الكمية
  const updateQuantity = (productId: string, quantity: number) => {
    contextUpdateCartQuantity(productId, quantity);
  };
  // تفريغ السلة
  const clearCart = () => {
    contextClearCart();
    showToast(t('cartUpdated'), 'info');
  };

  // التحقق من وجود منتج في السلة
  const isInCart = (productId: string): boolean => {
    return cartItems.some(item => item.id === productId);
  };

  // الحصول على كمية منتج معين في السلة
  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // تنسيق السعر الإجمالي مع رمز العملة
  const formattedTotalPrice = `${storeSettings.currencySymbol}${totalPrice.toFixed(2)}`;

  return {
    cartItems,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
};
