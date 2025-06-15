/**
 * ملف مساعد للشات بوت المحسن - محدث للتفاعل مع البيانات الحية
 * يوفر وظائف ومرافق للتعامل مع عرض المنتجات ومعالجة الطلبات المتعلقة بالمنتجات
 * يتفاعل مع البيانات الحية من المتجر ويعرض المعلومات المحدثة
 */

import { Product, LanguageCode, Category, StoreSettings, Translations } from '../types';

/**
 * إنشاء رسالة بعرض المنتجات المتاحة
 */
export const generateProductsListMessage = (
  products: Product[],
  language: LanguageCode,
  currencySymbol: string
): string => {
  if (products.length === 0) {
    return language === LanguageCode.AR
      ? '😔 عذراً، لا توجد منتجات متاحة حالياً.'
      : '😔 Sorry, no products are currently available.';
  }

  let message = language === LanguageCode.AR
    ? '🛍️ **متجر جين كرو - منتجاتنا المميزة:**\n\n'
    : '🛍️ **Jeancro Store - Our Featured Products:**\n\n';

  products.forEach((product, index) => {
    const name = product.name[language] || product.name[LanguageCode.EN];
    const description = product.description[language] || product.description[LanguageCode.EN];
    const shortDescription = description.length > 100 
      ? `${description.substring(0, 100)}...` 
      : description;

    message += `**${index + 1}. ${name}**\n\n`;
    message += `📝 ${shortDescription}\n\n`;
    message += `💰 **${currencySymbol}${product.price.toFixed(2)}**\n`;
    
    if (product.inStock !== false) {
      message += language === LanguageCode.AR 
        ? `✅ متوفر الآن\n\n`
        : `✅ Available Now\n\n`;
    } else {
      message += language === LanguageCode.AR 
        ? `❌ غير متوفر حالياً\n\n`
        : `❌ Currently Out of Stock\n\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
  });

  message += language === LanguageCode.AR
    ? '💡 **كيف تتفاعل معي؟**\n\n'
    : '💡 **How to interact with me?**\n\n';
    
  message += language === LanguageCode.AR
    ? '🔍 لمعرفة تفاصيل أكثر عن منتج: اكتب "المنتج رقم 1"\n'
    : '🔍 For more product details: type "product number 1"\n';
    
  message += language === LanguageCode.AR
    ? '🛒 لطلب منتج: اكتب "أريد طلب" أو "كيف أشتري"\n'
    : '🛒 To order a product: type "I want to order" or "how to buy"\n';
    
  message += language === LanguageCode.AR
    ? '📞 للتواصل المباشر: اكتب "التواصل" أو "واتساب"'
    : '📞 For direct contact: type "contact" or "whatsapp"';

  return message;
};

/**
 * إنشاء رسالة بتفاصيل منتج محدد
 */
export const generateProductDetailsMessage = (
  product: Product,
  language: LanguageCode,
  currencySymbol: string
): string => {
  const name = product.name[language] || product.name[LanguageCode.EN];
  const description = product.description[language] || product.description[LanguageCode.EN];
  const details = product.details[language] || product.details[LanguageCode.EN];

  let message = `🎯 **تفاصيل المنتج** | **Product Details**\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `🏷️ **${name}**\n\n`;
  message += `📸 [PRODUCT_IMAGE:${product.imageUrl}]\n\n`;
  message += `📝 **${language === LanguageCode.AR ? 'الوصف' : 'Description'}:**\n`;
  message += `${description}\n\n`;
  message += `💰 **${language === LanguageCode.AR ? 'السعر' : 'Price'}:** `;
  message += `${currencySymbol}${product.price.toFixed(2)}\n\n`;
  
  if (product.inStock !== false) {
    message += language === LanguageCode.AR 
      ? `✅ **الحالة:** متوفر الآن\n\n`
      : `✅ **Status:** Available Now\n\n`;
  } else {
    message += language === LanguageCode.AR 
      ? `❌ **الحالة:** غير متوفر حالياً\n\n`
      : `❌ **Status:** Currently Out of Stock\n\n`;
  }
  
  if (details?.features && details.features.length > 0) {
    message += `✨ **${language === LanguageCode.AR ? 'المميزات' : 'Features'}:**\n`;
    details.features.forEach(feature => {
      message += `• ${feature}\n`;
    });
    message += `\n`;
  }
  
  if (details?.specifications) {
    message += `📋 **${language === LanguageCode.AR ? 'المواصفات' : 'Specifications'}:**\n`;
    Object.entries(details.specifications).forEach(([key, value]) => {
      message += `• **${key}:** ${value}\n`;
    });
    message += `\n`;
  }
  
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += language === LanguageCode.AR
    ? `🛒 **هل تريد طلب هذا المنتج؟**\n\n`
    : `🛒 **Want to order this product?**\n\n`;
    
  message += language === LanguageCode.AR
    ? `💬 اكتب "أريد طلب هذا المنتج" أو "كيف أشتري" وسنساعدك في إتمام الطلب!\n\n`
    : `💬 Type "I want to order this product" or "how to buy" and we'll help you complete your order!\n\n`;
    
  message += language === LanguageCode.AR
    ? `📱 أو يمكنك التواصل معنا مباشرة عبر واتساب لطلب سريع!`
    : `📱 Or you can contact us directly via WhatsApp for quick ordering!`;

  return message;
};

/**
 * تحليل طلب المستخدم للحصول على منتج معين
 */
export const parseProductRequest = (message: string): number | null => {
  const productNumberPattern = /(?:product|منتج|product number|رقم المنتج|منتج رقم)\s*(\d+)/i;
  const match = message.match(productNumberPattern);
  
  if (match && match[1]) {
    const productNumber = parseInt(match[1], 10);
    return isNaN(productNumber) ? null : productNumber;
  }
  
  return null;
};

/**
 * فحص ما إذا كان المستخدم يسأل عن المنتجات
 */
export const isAskingAboutProducts = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  const arabicPatterns = [
    'منتج', 'منتجات', 'المنتجات', 'السلع', 'البضائع', 'الأصناف',
    'ما عندكم', 'شو عندكم', 'ايش عندكم', 'وش عندكم',
    'عرض المنتجات', 'اعرض المنتجات', 'المتاحة', 'المتوفرة',
    'الكتالوج', 'القائمة', 'المعروض', 'الموجود',
    'أريد أشوف', 'بدي أشوف', 'ممكن أشوف', 'ممكن أعرف',
    'ايش موجود', 'شو موجود', 'ما هو متوفر', 'متوفر عندكم'
  ];
  
  const englishPatterns = [
    'product', 'products', 'item', 'items', 'catalog', 'catalogue',
    'show products', 'show me', 'what do you have', 'what products',
    'available', 'collection', 'inventory', 'merchandise',
    'browse', 'shopping', 'clothes', 'clothing',
    'what can i buy', 'what\'s available', 'show catalog'
  ];
  
  return [...arabicPatterns, ...englishPatterns].some(pattern => 
    lowerMessage.includes(pattern)
  );
};

/**
 * باقي الوظائف...
 */
export const isAskingAboutOrdering = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'كيف أطلب', 'كيف أشتري', 'أريد أطلب', 'بدي أطلب',
    'how to order', 'how to buy', 'i want to order', 'ordering process'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const isAskingAboutPayments = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'دفع', 'مدفوعات', 'الدفع', 'payment', 'pay', 'payments'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const isAskingAboutShipping = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'شحن', 'الشحن', 'توصيل', 'التوصيل', 'shipping', 'delivery'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const isAskingAboutContact = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'تواصل', 'التواصل', 'واتساب', 'whatsapp', 'contact', 'phone'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const isAskingAboutNewProducts = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'جديد', 'جديدة', 'آخر', 'أحدث', 'new', 'latest', 'recent'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const isAskingAboutStoreInfo = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'معلومات', 'عن المتجر', 'من أنتم', 'about', 'about us', 'store info'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const isAskingAboutStats = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'كم منتج', 'عدد المنتجات', 'إحصائيات', 'how many', 'statistics', 'stats'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

export const parseProductCategory = (message: string, categories: Category[]): string | null => {
  const lowerMessage = message.toLowerCase();
  
  for (const category of categories) {
    const arabicName = category.name.AR?.toLowerCase();
    const englishName = category.name.EN?.toLowerCase();
    
    if ((arabicName && lowerMessage.includes(arabicName)) ||
        (englishName && lowerMessage.includes(englishName))) {
      return category.id;
    }
  }
  
  return null;
};

// رسائل مولّدة
export const generateContactMessage = (language: LanguageCode, whatsappNumber?: string): string => {
  let message = language === LanguageCode.AR
    ? '📞 **معلومات التواصل:**\n\n'
    : '📞 **Contact Information:**\n\n';
    
  if (whatsappNumber) {
    message += language === LanguageCode.AR
      ? `📱 **واتساب:** ${whatsappNumber}\n`
      : `📱 **WhatsApp:** ${whatsappNumber}\n`;
  }
  
  return message;
};

export const generateOrderingInstructionsMessage = (language: LanguageCode): string => {
  return language === LanguageCode.AR
    ? '🛒 **كيفية تقديم الطلبات:**\n\n1. اختر المنتج المطلوب\n2. تواصل معنا عبر واتساب\n3. سنساعدك في إتمام الطلب'
    : '🛒 **How to Place Orders:**\n\n1. Choose your desired product\n2. Contact us via WhatsApp\n3. We\'ll help you complete your order';
};

export const generatePaymentMethodsMessage = (language: LanguageCode): string => {
  return language === LanguageCode.AR
    ? '💳 **طرق الدفع:**\n\n• الدفع عند الاستلام\n• البطاقات البنكية\n• التحويل البنكي'
    : '💳 **Payment Methods:**\n\n• Cash on Delivery\n• Credit Cards\n• Bank Transfer';
};

export const generateShippingInfoMessage = (language: LanguageCode): string => {
  return language === LanguageCode.AR
    ? '🚚 **معلومات الشحن:**\n\n• الشحن العادي: 3-5 أيام\n• الشحن السريع: 1-2 يوم\n• شحن مجاني للطلبات فوق 500 درهم'
    : '🚚 **Shipping Information:**\n\n• Standard: 3-5 days\n• Express: 1-2 days\n• Free shipping over 500 MAD';
};

// الوظائف الجديدة المحسنة
export const generateNewProductsMessage = (
  products: Product[],
  language: LanguageCode,
  currencySymbol: string,
  limit: number = 3
): string => {
  const latestProducts = products.slice(-limit).reverse();
  
  if (latestProducts.length === 0) {
    return language === LanguageCode.AR
      ? '🆕 لا توجد منتجات جديدة حالياً.'
      : '🆕 No new products available at the moment.';
  }

  let message = language === LanguageCode.AR
    ? '🆕 **آخر منتجاتنا الجديدة:**\n\n'
    : '🆕 **Our Latest Products:**\n\n';

  latestProducts.forEach((product, index) => {
    const name = product.name[language] || product.name[LanguageCode.EN];
    const description = product.description[language] || product.description[LanguageCode.EN];
    const shortDesc = description.length > 80 
      ? `${description.substring(0, 80)}...` 
      : description;

    message += `✨ **${index + 1}. ${name}**\n\n`;
    message += `📝 ${shortDesc}\n\n`;
    message += `💰 **${currencySymbol}${product.price.toFixed(2)}**\n`;
    
    if (product.inStock !== false) {
      message += language === LanguageCode.AR 
        ? `✅ متوفر الآن\n\n`
        : `✅ Available Now\n\n`;
    } else {
      message += language === LanguageCode.AR 
        ? `⏳ سيتوفر قريباً\n\n`
        : `⏳ Coming Soon\n\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
  });
  
  message += language === LanguageCode.AR
    ? '💡 **اكتب رقم المنتج لمعرفة التفاصيل الكاملة!**'
    : '💡 **Type the product number for full details!**';

  return message;
};

export const generateStoreInfoMessage = (
  storeSettings: StoreSettings,
  language: LanguageCode,
  stats?: {
    totalProducts: number;
    totalCategories: number;
    availableProducts: number;
  }
): string => {
  const storeName = storeSettings.storeName;
  
  let message = language === LanguageCode.AR
    ? `🏪 **مرحباً بك في متجر ${storeName}!**\n\n`
    : `🏪 **Welcome to ${storeName} Store!**\n\n`;
    
  if (language === LanguageCode.AR) {
    message += `🌟 **من نحن؟**\n`;
    message += `نحن متجر جينكرو المتخصص في الأزياء العصرية والملابس المصنوعة يدوياً.\n\n`;
    
    if (stats) {
      message += `📊 **إحصائياتنا:**\n`;
      message += `📦 ${stats.totalProducts} منتج إجمالي\n`;
      message += `✅ ${stats.availableProducts} منتج متوفر\n`;
      message += `🏷️ ${stats.totalCategories} فئة مختلفة\n\n`;
    }
    
    if (storeSettings.whatsappNumber) {
      message += `📱 واتساب: ${storeSettings.whatsappNumber}\n`;
    }
  } else {
    message += `🌟 **Who We Are?**\n`;
    message += `We are Jeancro store, specializing in modern fashion and handmade clothing.\n\n`;
    
    if (stats) {
      message += `📊 **Our Stats:**\n`;
      message += `📦 ${stats.totalProducts} total products\n`;
      message += `✅ ${stats.availableProducts} available products\n`;
      message += `🏷️ ${stats.totalCategories} categories\n\n`;
    }
    
    if (storeSettings.whatsappNumber) {
      message += `📱 WhatsApp: ${storeSettings.whatsappNumber}\n`;
    }
  }
  
  return message;
};

export const generateStatsMessage = (
  stats: {
    totalProducts: number;
    totalCategories: number;
    availableProducts: number;
    outOfStockProducts: number;
  },
  language: LanguageCode
): string => {
  let message = language === LanguageCode.AR
    ? '📊 **إحصائيات متجر جينكرو:**\n\n'
    : '📊 **Jeancro Store Statistics:**\n\n';
    
  if (language === LanguageCode.AR) {
    message += `📦 **إجمالي المنتجات:** ${stats.totalProducts}\n\n`;
    message += `✅ **منتجات متوفرة:** ${stats.availableProducts}\n\n`;
    message += `❌ **منتجات غير متوفرة:** ${stats.outOfStockProducts}\n\n`;
    message += `🏷️ **عدد الفئات:** ${stats.totalCategories}\n\n`;
    message += `💡 **نقوم بتحديث منتجاتنا باستمرار!**`;
  } else {
    message += `📦 **Total Products:** ${stats.totalProducts}\n\n`;
    message += `✅ **Available Products:** ${stats.availableProducts}\n\n`;
    message += `❌ **Out of Stock:** ${stats.outOfStockProducts}\n\n`;
    message += `🏷️ **Categories:** ${stats.totalCategories}\n\n`;
    message += `💡 **We constantly update our products!**`;
  }
  
  return message;
};

export const generateCategoryProductsMessage = (
  products: Product[],
  categoryName: string,
  language: LanguageCode,
  currencySymbol: string
): string => {
  if (products.length === 0) {
    return language === LanguageCode.AR
      ? `😔 عذراً، لا توجد منتجات في فئة "${categoryName}" حالياً.`
      : `😔 Sorry, no products found in "${categoryName}" category.`;
  }

  let message = language === LanguageCode.AR
    ? `🏷️ **منتجات فئة "${categoryName}":**\n\n`
    : `🏷️ **Products in "${categoryName}" Category:**\n\n`;

  products.forEach((product, index) => {
    const name = product.name[language] || product.name[LanguageCode.EN];
    const description = product.description[language] || product.description[LanguageCode.EN];
    const shortDesc = description.length > 60 
      ? `${description.substring(0, 60)}...` 
      : description;

    message += `${index + 1}. **${name}**\n`;
    message += `   ${shortDesc}\n`;
    message += `   💰 ${currencySymbol}${product.price.toFixed(2)}\n`;
    
    if (product.inStock !== false) {
      message += language === LanguageCode.AR ? `   ✅ متوفر\n\n` : `   ✅ Available\n\n`;
    } else {
      message += language === LanguageCode.AR ? `   ❌ غير متوفر\n\n` : `   ❌ Out of Stock\n\n`;
    }
  });
  
  message += language === LanguageCode.AR
    ? '💡 اكتب رقم المنتج لمعرفة التفاصيل!'
    : '💡 Type product number for details!';

  return message;
};

/**
 * دالة شاملة لمعالجة الرسائل
 */
export const processUserMessage = (
  message: string,
  context: {
    products: Product[];
    categories: Category[];
    storeSettings: StoreSettings;
  },
  language: LanguageCode,
  options?: {
    onNewConversationRequest?: () => void;
  }
): string => {
  const { products, categories, storeSettings } = context;
  const currencySymbol = storeSettings.currencySymbol;
  
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    availableProducts: products.filter(p => p.inStock !== false).length,
    outOfStockProducts: products.filter(p => p.inStock === false).length
  };
  
  // فحص طلب محادثة جديدة أولاً
  if (isRequestingNewConversation(message)) {
    // إذا كان هناك callback لمسح المحادثة، استدعه
    if (options?.onNewConversationRequest) {
      options.onNewConversationRequest();
    }
    
    // إرجاع رسالة ترحيب للمحادثة الجديدة
    return generateNewConversationWelcomeMessage(language, storeSettings);
  }
  
  if (isAskingAboutNewProducts(message)) {
    return generateNewProductsMessage(products, language, currencySymbol);
  }
  
  if (isAskingAboutStoreInfo(message)) {
    return generateStoreInfoMessage(storeSettings, language, stats);
  }
  
  if (isAskingAboutStats(message)) {
    return generateStatsMessage(stats, language);
  }
  
  const categoryId = parseProductCategory(message, categories);
  if (categoryId) {
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    const category = categories.find(c => c.id === categoryId);
    const categoryName = category ? 
      (category.name[language] || category.name[LanguageCode.EN]) : 
      'Unknown';
    return generateCategoryProductsMessage(categoryProducts, categoryName, language, currencySymbol);
  }
  
  const productNumber = parseProductRequest(message);
  if (productNumber && productNumber <= products.length && productNumber > 0) {
    const product = products[productNumber - 1];
    if (product) {
      return generateProductDetailsMessage(product, language, currencySymbol);
    }
  }
  
  if (isAskingAboutProducts(message)) {
    return generateProductsListMessage(products, language, currencySymbol);
  }
  
  if (isAskingAboutOrdering(message)) {
    return generateOrderingInstructionsMessage(language);
  }
  
  if (isAskingAboutPayments(message)) {
    return generatePaymentMethodsMessage(language);
  }
  
  if (isAskingAboutShipping(message)) {
    return generateShippingInfoMessage(language);
  }
  
  if (isAskingAboutContact(message)) {
    return generateContactMessage(language, storeSettings.whatsappNumber);
  }
  
  return language === LanguageCode.AR
    ? `🤖 أعتذر، لم أفهم طلبك بوضوح. يمكنك أن تسأل عن:\n\n` +
      `🛍️ المنتجات - اكتب "المنتجات" (${stats.totalProducts} منتج متاح)\n` +
      `🆕 المنتجات الجديدة - اكتب "جديد"\n` +
      `📊 إحصائيات المتجر - اكتب "إحصائيات"\n` +
      `🏪 معلومات المتجر - اكتب "عن المتجر"\n` +
      `📞 التواصل - اكتب "تواصل"`
    : `🤖 Sorry, I didn't understand your request. You can ask about:\n\n` +
      `🛍️ Products - type "products" (${stats.totalProducts} available)\n` +
      `🆕 New products - type "new"\n` +
      `📊 Store statistics - type "stats"\n` +
      `🏪 Store information - type "about"\n` +
      `📞 Contact - type "contact"`;
};

/**
 * فحص ما إذا كان المستخدم يريد بدء محادثة جديدة
 * @param message رسالة المستخدم
 * @returns true إذا كان المستخدم يريد بدء محادثة جديدة
 */
export const isRequestingNewConversation = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  const arabicPatterns = [
    'محادثة جديدة',
    'محادثه جديده',
    'مسح المحادثة',
    'مسح المحادثه',
    'حذف المحادثة',
    'حذف المحادثه',
    'ابدأ من جديد',
    'ابدا من جديد',
    'بداية جديدة',
    'بدايه جديده',
    'امسح الشات',
    'امسح الكلام',
    'نظف الشات',
    'صفحة جديدة',
    'صفحه جديده',
    'ريست',
    'reset',
    'جديد',
    'من البداية',
    'من البدايه'
  ];
  
  const englishPatterns = [
    'new conversation',
    'new chat',
    'clear chat',
    'clear conversation',
    'delete chat',
    'delete conversation',
    'reset chat',
    'reset conversation',
    'start over',
    'start again',
    'fresh start',
    'clean slate',
    'new start',
    'restart',
    'clear all',
    'clear history',
    'reset',
    'refresh'
  ];
  
  return [...arabicPatterns, ...englishPatterns].some(pattern => 
    lowerMessage.includes(pattern)
  );
};

/**
 * إنشاء رسالة ترحيب لمحادثة جديدة
 * @param language اللغة المستخدمة
 * @param storeSettings إعدادات المتجر
 * @returns رسالة ترحيب مخصصة
 */
export const generateNewConversationWelcomeMessage = (
  language: LanguageCode,
  storeSettings: StoreSettings
): string => {
  const storeName = storeSettings.storeName;
  const currentDate = new Date().toLocaleDateString(
    language === LanguageCode.AR ? 'ar-EG' : 'en-US'
  );
  
  let message = '';
  
  if (language === LanguageCode.AR) {
    message = `🌟 **مرحباً بك في محادثة جديدة مع ${storeName}!** 🌟\n\n`;
    message += `📅 **التاريخ:** ${currentDate}\n`;
    message += `🤖 **أنا مساعدك الذكي في جينكرو**\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `✨ **ماذا يمكنني أن أساعدك اليوم؟**\n\n`;
    message += `🛍️ **اكتب "المنتجات"** لرؤية منتجاتنا المميزة\n`;
    message += `🆕 **اكتب "جديد"** لرؤية آخر المنتجات\n`;
    message += `🏷️ **اكتب "رجال" أو "نساء"** لفئة معينة\n`;
    message += `📊 **اكتب "إحصائيات"** لمعرفة أرقام المتجر\n`;
    message += `🏪 **اكتب "عن المتجر"** لمعرفة المزيد عنا\n`;
    message += `📞 **اكتب "تواصل"** للحصول على معلومات التواصل\n`;
    message += `🛒 **اكتب "كيف أطلب"** لمعرفة طريقة الطلب\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💡 **نصيحة:** يمكنك كتابة أي سؤال وسأحاول مساعدتك!\n`;
    message += `🔄 **لبدء محادثة جديدة مرة أخرى:** اكتب "محادثة جديدة"`;
  } else {
    message = `🌟 **Welcome to a new conversation with ${storeName}!** 🌟\n\n`;
    message += `📅 **Date:** ${currentDate}\n`;
    message += `🤖 **I'm your smart assistant at Jeancro**\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `✨ **How can I help you today?**\n\n`;
    message += `🛍️ **Type "products"** to see our featured items\n`;
    message += `🆕 **Type "new"** to see our latest products\n`;
    message += `🏷️ **Type "men" or "women"** for specific categories\n`;
    message += `📊 **Type "stats"** to see store statistics\n`;
    message += `🏪 **Type "about"** to learn more about us\n`;
    message += `📞 **Type "contact"** for contact information\n`;
    message += `🛒 **Type "how to order"** to learn how to place orders\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💡 **Tip:** You can ask me any question and I'll try to help!\n`;
    message += `🔄 **To start a new conversation again:** type "new conversation"`;
  }
  
  return message;
};

/**
 * إنشاء رسالة تأكيد مسح المحادثة
 * @param translations الترجمات المتاحة
 * @returns رسالة تأكيد المسح
 */
export const generateConversationClearedMessage = (translations: Translations): string => {
  return `🧹 ${translations.chatCleared}\n\n✨ ${translations.chatWelcomeNew}`;
};
