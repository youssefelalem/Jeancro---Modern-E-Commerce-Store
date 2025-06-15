/**
 * ملف مساعد للشات بوت
 * يوفر وظائف ومرافق للتعامل مع عرض المنتجات ومعالجة الطلبات المتعلقة بالمنتجات
 */

import { Product, LanguageCode } from '../types';

/**
 * إنشاء رسالة بعرض المنتجات المتاحة
 * @param products قائمة المنتجات
 * @param language اللغة المستخدمة
 * @param currencySymbol رمز العملة
 * @returns نص رسالة الشات بوت المنسقة لعرض المنتجات
 */
export const generateProductsListMessage = (
  products: Product[],
  language: LanguageCode,
  currencySymbol: string
): string => {
  if (products.length === 0) {
    return language === LanguageCode.AR
      ? '🛍️ عذراً، لا توجد منتجات متوفرة حالياً.'
      : '🛍️ Sorry, there are no products available at the moment.';
  }

  let message = language === LanguageCode.AR
    ? '🛍️ **متجر جين كرو - منتجاتنا المميزة:**\n\n'
    : '🛍️ **Jeancro Store - Our Featured Products:**\n\n';

  products.forEach((product, index) => {
    const name = product.name[language] || product.name[LanguageCode.EN];
    const description = product.description[language] || product.description[LanguageCode.EN];
    const shortDesc = description.length > 60 
      ? `${description.substring(0, 60)}...` 
      : description;

    // تنسيق محسن مع رموز تعبيرية وخطوط فاصلة
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 **${index + 1}. ${name}**\n\n`;
    message += `📝 *${shortDesc}*\n\n`;
    message += `💰 **${language === LanguageCode.AR ? 'السعر' : 'Price'}:** ${currencySymbol}${product.price.toFixed(2)}\n`;
    
    // إضافة معلومة عن توفر المنتج
    if (product.inStock !== false) {
      message += language === LanguageCode.AR 
        ? `✅ **متوفر الآن**\n\n`
        : `✅ **Available Now**\n\n`;
    } else {
      message += language === LanguageCode.AR 
        ? `❌ **غير متوفر حالياً**\n\n`
        : `❌ **Currently Out of Stock**\n\n`;
    }  });

  // إضافة خط فاصل نهائي
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  
  // تعليمات محسنة للمستخدم
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
 * @param product المنتج المراد عرض تفاصيله
 * @param language اللغة المستخدمة
 * @param currencySymbol رمز العملة
 * @returns نص رسالة الشات بوت المنسقة لعرض تفاصيل المنتج
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
  
  // اسم المنتج مع رمز تعبيري
  message += `🏷️ **${name}**\n\n`;
  
  // إضافة صورة المنتج
  message += `📸 [PRODUCT_IMAGE:${product.imageUrl}]\n\n`;
  
  // الوصف
  message += `📝 **${language === LanguageCode.AR ? 'الوصف' : 'Description'}:**\n`;
  message += `${description}\n\n`;
  
  // السعر مع تنسيق جذاب
  message += `💰 **${language === LanguageCode.AR ? 'السعر' : 'Price'}:** `;
  message += `${currencySymbol}${product.price.toFixed(2)}\n\n`;
  
  // حالة التوفر
  if (product.inStock !== false) {
    message += language === LanguageCode.AR 
      ? `✅ **الحالة:** متوفر الآن\n\n`
      : `✅ **Status:** Available Now\n\n`;
  } else {
    message += language === LanguageCode.AR 
      ? `❌ **الحالة:** غير متوفر حالياً\n\n`
      : `❌ **Status:** Currently Out of Stock\n\n`;
  }
  
  // المميزات
  if (details.features && details.features.length > 0) {
    message += `⭐ **${language === LanguageCode.AR ? 'المميزات' : 'Features'}:**\n`;
      
    details.features.forEach(feature => {
      message += `  🔸 ${feature}\n`;
    });
    message += '\n';
  }
    // المواصفات
  if (details.specifications) {
    message += `🔧 **${language === LanguageCode.AR ? 'المواصفات' : 'Specifications'}:**\n`;
      
    Object.entries(details.specifications).forEach(([key, value]) => {
      message += `  🔹 ${key}: ${value}\n`;
    });
    message += '\n';
  }
  
  // خط فاصل وتعليمات الطلب
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
 * @param message رسالة المستخدم
 * @returns رقم المنتج إذا كان موجوداً، أو null إذا لم يكن هناك طلب لمنتج محدد
 */
export const parseProductRequest = (message: string): number | null => {
  const productNumberPattern = /(?:product|منتج|product number|رقم المنتج|منتج رقم)\s*(\d+)/i;
  const match = message.match(productNumberPattern);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
};

/**
 * فحص ما إذا كان المستخدم يسأل عن المنتجات
 * @param message رسالة المستخدم
 * @returns true إذا كان المستخدم يسأل عن المنتجات، false خلاف ذلك
 */
export const isAskingAboutProducts = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  return lowerMessage.includes('منتج') || 
         lowerMessage.includes('منتجات') || 
         lowerMessage.includes('المنتجات') || 
         lowerMessage.includes('product') || 
         lowerMessage.includes('products') ||
         lowerMessage.includes('عرض المنتجات') ||
         lowerMessage.includes('show products') ||
         lowerMessage.includes('المتاحة') ||
         lowerMessage.includes('available');
};

/**
 * فحص ما إذا كان المستخدم يسأل عن كيفية تقديم الطلبات
 * @param message رسالة المستخدم
 * @returns true إذا كان المستخدم يسأل عن تقديم الطلبات
 */
export const isAskingAboutOrdering = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  return lowerMessage.includes('كيف أطلب') ||
         lowerMessage.includes('تقديم طلب') ||
         lowerMessage.includes('كيفية الطلب') ||
         lowerMessage.includes('خطوات الطلب') ||
         lowerMessage.includes('how to order') ||
         lowerMessage.includes('placing order') ||
         lowerMessage.includes('order process') ||
         lowerMessage.includes('كيف أشتري') ||
         lowerMessage.includes('الشراء') ||
         lowerMessage.includes('شراء منتج') ||
         lowerMessage.includes('يمكنني شراء') ||
         lowerMessage.includes('كيف يمكنني شراء') ||
         lowerMessage.includes('سلة التسوق') ||
         lowerMessage.includes('checkout') ||
         lowerMessage.includes('purchase') ||
         lowerMessage.includes('how can i purchase') ||
         lowerMessage.includes('how to purchase') ||
         lowerMessage.includes('how to buy') ||
         lowerMessage.includes('buying process') ||
         lowerMessage.includes('purchasing');
};

/**
 * فحص ما إذا كان المستخدم يسأل عن المدفوعات
 * @param message رسالة المستخدم
 * @returns true إذا كان المستخدم يسأل عن المدفوعات
 */
export const isAskingAboutPayments = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  return lowerMessage.includes('دفع') ||
         lowerMessage.includes('مدفوعات') ||
         lowerMessage.includes('طريقة الدفع') ||
         lowerMessage.includes('طرق الدفع') ||
         lowerMessage.includes('payment') ||
         lowerMessage.includes('pay') ||
         lowerMessage.includes('billing') ||
         lowerMessage.includes('كاش') ||
         lowerMessage.includes('cash') ||
         lowerMessage.includes('بطاقة') ||
         lowerMessage.includes('card') ||
         lowerMessage.includes('تحويل') ||
         lowerMessage.includes('transfer') ||
         lowerMessage.includes('عند الاستلام');
};

/**
 * فحص ما إذا كان المستخدم يسأل عن الشحن
 * @param message رسالة المستخدم
 * @returns true إذا كان المستخدم يسأل عن الشحن
 */
export const isAskingAboutShipping = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  return lowerMessage.includes('شحن') ||
         lowerMessage.includes('توصيل') ||
         lowerMessage.includes('وقت التوصيل') ||
         lowerMessage.includes('تكلفة الشحن') ||
         lowerMessage.includes('shipping') ||
         lowerMessage.includes('delivery') ||
         lowerMessage.includes('shipping cost') ||
         lowerMessage.includes('delivery time') ||
         lowerMessage.includes('كم يوم') ||
         lowerMessage.includes('متى يصل');
};

/**
 * فحص ما إذا كان المستخدم يطلب التواصل أو رقم WhatsApp
 * @param message رسالة المستخدم
 * @returns true إذا كان المستخدم يطلب التواصل
 */
export const isAskingAboutContact = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  return lowerMessage.includes('تواصل') ||
         lowerMessage.includes('واتساب') ||
         lowerMessage.includes('whatsapp') ||
         lowerMessage.includes('contact') ||
         lowerMessage.includes('رقم') ||
         lowerMessage.includes('number') ||
         lowerMessage.includes('هاتف') ||
         lowerMessage.includes('phone') ||
         lowerMessage.includes('اتصال') ||
         lowerMessage.includes('call') ||
         lowerMessage.includes('التواصل') ||
         lowerMessage.includes('المباشر') ||
         lowerMessage.includes('direct') ||
         lowerMessage.includes('communicate') ||
         lowerMessage.includes('reach') ||
         lowerMessage.includes('get in touch');
};

/**
 * إنشاء رسالة بمعلومات التواصل ورقم WhatsApp
 * @param language اللغة المستخدمة
 * @param whatsappNumber رقم WhatsApp من إعدادات المتجر
 * @returns نص رسالة الشات بوت بمعلومات التواصل
 */
export const generateContactMessage = (
  language: LanguageCode, 
  whatsappNumber?: string
): string => {
  if (language === LanguageCode.AR) {
    let message = `📞 **طرق التواصل مع متجر جينكرو:**\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (whatsappNumber) {
      message += `💚 **واتساب (الطريقة المفضلة):**\n`;
      message += `📱 ${whatsappNumber}\n\n`;
      message += `🚀 **المميزات:**\n`;
      message += `  🔸 رد سريع خلال دقائق\n`;
      message += `  🔸 إرسال صور للمنتجات\n`;
      message += `  🔸 تأكيد الطلبات فوري\n`;
      message += `  🔸 متابعة حالة الطلب\n\n`;    } else {
      message += `💚 **واتساب:**\n`;
      message += `📱 +212123456789\n\n`;
    }
    
    message += `📧 **البريد الإلكتروني:**\n`;
    message += `✉️ info@jeancro.com\n\n`;
    
    message += `🕒 **أوقات الاستجابة:**\n`;
    message += `  🔸 واتساب: فوري (24/7)\n`;
    message += `  🔸 البريد: خلال 24 ساعة\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💡 **نصيحة:** اكتب "أريد طلب" وسأساعدك في إعداد طلبك وإرساله مباشرة عبر واتساب!`;
    
    return message;
  } else {
    let message = `📞 **Contact Jeancro Store:**\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (whatsappNumber) {
      message += `💚 **WhatsApp (Preferred Method):**\n`;
      message += `📱 ${whatsappNumber}\n\n`;
      message += `🚀 **Benefits:**\n`;
      message += `  🔸 Quick response within minutes\n`;
      message += `  🔸 Send product images\n`;
      message += `  🔸 Instant order confirmation\n`;
      message += `  🔸 Order status tracking\n\n`;
    } else {
      message += `💚 **WhatsApp:**\n`;
      message += `📱 Coming soon - We'll add the number shortly\n\n`;
    }
    
    message += `📧 **Email:**\n`;
    message += `✉️ info@jeancro.com\n\n`;
    
    message += `🕒 **Response Times:**\n`;
    message += `  🔸 WhatsApp: Instant (24/7)\n`;
    message += `  🔸 Email: Within 24 hours\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💡 **Tip:** Type "I want to order" and I'll help you prepare and send your order directly via WhatsApp!`;
    
    return message;
  }
};

/**
 * إنشاء رسالة تفصيلية عن كيفية تقديم الطلبات
 * @param language اللغة المستخدمة
 * @returns نص مفصل عن عملية تقديم الطلبات
 */
export const generateOrderingInstructionsMessage = (language: LanguageCode): string => {
  if (language === LanguageCode.AR) {
    return `🛍️ **دليل الطلب السريع - متجر جينكرو**
━━━━━━━━━━━━━━━━━━

✨ **خطوات بسيطة لطلبك:**

🔍 **1. تصفح واختر**
   • تصفح مجموعة منتجاتنا المميزة
   • اختر المنتج الذي يعجبك

📱 **2. أرسل طلبك بسهولة**
   • اضغط على "إضافة إلى السلة"
   • اضغط على زر "إرسال عبر WhatsApp"
   • سيتم فتح واتساب مع تفاصيل طلبك جاهزة

⚡ **3. تأكيد فوري**
   • فريقنا سيرد عليك خلال دقائق
   • تأكيد الطلب وتفاصيل التوصيل
   • اختيار طريقة الدفع المناسبة

🚚 **4. استلام سريع**
   • توصيل مجاني للطلبات فوق 500 د.م
   • خدمة توصيل سريعة وآمنة
   • ضمان الجودة والرضا التام

💰 **طرق الدفع المتاحة:**
   ✅ الدفع عند الاستلام (مفضل)
   ✅ بطاقات الائتمان
   ✅ التحويل البنكي
   ✅ PayPal

🎯 **لماذا جينكرو؟**
   • منتجات عالية الجودة
   • أسعار تنافسية
   • خدمة عملاء مميزة
   • توصيل سريع وموثوق
   
📞 **هل تحتاج مساعدة؟** اكتب "تواصل" للحصول على رقم واتساب المباشر!`;
  } else {
    return `🛍️ **Quick Order Guide - Jeancro Store**
━━━━━━━━━━━━━━━━━━

✨ **Simple Steps for Your Order:**

🔍 **1. Browse & Choose**
   • Explore our premium product collection
   • Select the product you love

📱 **2. Send Your Order Easily**
   • Click "Add to Cart"
   • Click "Send via WhatsApp" button
   • WhatsApp will open with your order details ready

⚡ **3. Instant Confirmation**
   • Our team will reply within minutes
   • Order confirmation and delivery details
   • Choose your preferred payment method

🚚 **4. Fast Delivery**
   • Free shipping for orders over 500 MAD
   • Quick and secure delivery service
   • Quality and satisfaction guarantee

💰 **Available Payment Methods:**
   ✅ Cash on Delivery (preferred)
   ✅ Credit/Debit Cards
   ✅ Bank Transfer
   ✅ PayPal

🎯 **Why Choose Jeancro?**
   • High-quality products
   • Competitive prices
   • Excellent customer service
   • Fast and reliable delivery
   
📞 **Need Help?** Type "contact" to get our direct WhatsApp number!`;
  }
};

/**
 * إنشاء رسالة تفصيلية عن طرق الدفع
 * @param language اللغة المستخدمة
 * @returns نص مفصل عن طرق الدفع المتاحة
 */
export const generatePaymentMethodsMessage = (language: LanguageCode): string => {
  if (language === LanguageCode.AR) {
    return `**طرق الدفع المتاحة في متجر جينكرو:**

💰 **الدفع عند الاستلام**
   - ادفع للمندوب عند وصول الطلب
   - بدون رسوم إضافية
   - الطريقة الأكثر أماناً

💳 **البطاقات البنكية**
   - Visa و Mastercard
   - دفع آمن ومشفر بتقنية SSL
   - تأكيد فوري للطلب

🏦 **التحويل البنكي**
   - تحويل مباشر لحساب المتجر
   - يرجى إرسال إيصال التحويل
   - معالجة الطلب خلال 24 ساعة

🌐 **PayPal**
   - دفع دولي آمن
   - حماية للمشتري
   - سهولة في الاستخدام

📱 **الدفع الإلكتروني**
   - عبر البنوك المحلية
   - تطبيقات الدفع الإلكتروني
   - تأكيد فوري

**ضمانات الأمان:**
✅ جميع المعاملات مشفرة
✅ عدم حفظ بيانات البطاقات
✅ إمكانية الإرجاع والاستبدال

أي طريقة دفع تفضل؟`;
  } else {
    return `**Available Payment Methods at Jeancro:**

💰 **Cash on Delivery**
   - Pay the delivery person upon arrival
   - No additional fees
   - Most secure method

💳 **Bank Cards**
   - Visa & Mastercard accepted
   - Secure SSL encrypted payment
   - Instant order confirmation

🏦 **Bank Transfer**
   - Direct transfer to store account
   - Please send transfer receipt
   - Order processed within 24 hours

🌐 **PayPal**
   - Secure international payment
   - Buyer protection
   - Easy to use

📱 **Electronic Payment**
   - Through local banks
   - Mobile payment apps
   - Instant confirmation

**Security Guarantees:**
✅ All transactions encrypted
✅ Card details not stored
✅ Return & exchange available

Which payment method do you prefer?`;
  }
};

/**
 * إنشاء رسالة تفصيلية عن الشحن والتوصيل
 * @param language اللغة المستخدمة
 * @returns نص مفصل عن خدمات الشحن
 */
export const generateShippingInfoMessage = (language: LanguageCode): string => {
  if (language === LanguageCode.AR) {
    return `**معلومات الشحن والتوصيل في متجر جينكرو:**

🚚 **تكلفة الشحن:**
   - مجاني للطلبات أكثر من 500 درهم
   - 30 درهم للطلبات الأقل

📍 **مناطق التوصيل:**
   - جميع أنحاء المغرب
   - التوصيل للمنزل أو المكتب
   - إمكانية الاستلام من المتجر

⏰ **أوقات التوصيل:**
   - داخل الدار البيضاء: 1-2 يوم عمل
   - المدن الرئيسية: 2-3 أيام عمل
   - المناطق النائية: 3-5 أيام عمل
   - الشحن الدولي: 7-14 يوم عمل

📦 **معالجة الطلبات:**
   - تجهيز الطلب: 24-48 ساعة
   - تأكيد الشحن عبر SMS
   - رقم تتبع للمتابعة

🕒 **أوقات العمل للتوصيل:**
   - السبت - الخميس: 9 صباحاً - 6 مساءً
   - الجمعة: راحة
   - إمكانية تحديد وقت مفضل

✅ **ضمانات التوصيل:**
   - تغليف آمن ومحترف
   - فحص المنتج قبل الاستلام
   - إرجاع مجاني في حالة عدم المطابقة

هل تريد معرفة تكلفة الشحن لمنطقتك؟`;
  } else {
    return `**Shipping & Delivery Information at Jeancro:**

🚚 **Shipping Costs:**
   - Free for orders over 500 MAD
   - 30 MAD for smaller orders

📍 **Delivery Areas:**
   - All Morocco regions
   - Home or office delivery
   - Store pickup available

⏰ **Delivery Times:**
   - Casablanca area: 1-2 business days
   - Major cities: 2-3 business days
   - Remote areas: 3-5 business days
   - International: 7-14 business days

📦 **Order Processing:**
   - Order preparation: 24-48 hours
   - SMS shipping confirmation
   - Tracking number provided

🕒 **Delivery Hours:**
   - Saturday - Thursday: 9 AM - 6 PM
   - Friday: Rest day
   - Preferred time slot available

✅ **Delivery Guarantees:**
   - Professional secure packaging
   - Product inspection before receipt
   - Free return if not matching

Want to know shipping cost for your area?`;
  }
};
