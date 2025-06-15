import { INITIAL_PRODUCTS, TRANSLATIONS, INITIAL_CATEGORIES } from '@/constants';
import type { FAQ, Product, StoreSettings, Category } from '@/types';
import { LanguageCode } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  processUserMessage
} from './utils/chatbotHelper';

// التأكد من توفر مفتاح API في متغيرات البيئة
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    'مفتاح Gemini API غير موجود. يرجى تعيين متغير البيئة VITE_GEMINI_API_KEY.'
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || 'مفتاح_API_مفقود');
const modelName = 'gemini-1.5-flash';

// وظيفة للحصول على رد من شات بوت Gemini المحسن
export const getChatbotResponse = async (
  message: string,
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
  faqs: FAQ[],
  currentLanguage: LanguageCode,
  products: Product[] = INITIAL_PRODUCTS,
  storeSettings?: StoreSettings,
  categories: Category[] = INITIAL_CATEGORIES
): Promise<string> => {
  if (!API_KEY) {
    return (
      TRANSLATIONS[currentLanguage].errorOccurred ||
      'API Key for Gemini is not configured.'
    );
  }

  // إعداد السياق الافتراضي للمتجر
  const defaultStoreSettings: StoreSettings = {
    storeName: 'Jeancro',
    currencySymbol: 'د.م',
    whatsappNumber: '+212123456789',
    defaultLanguage: currentLanguage,
    socialMediaLinks: {
      instagram: 'https://instagram.com/jeancro',
      facebook: 'https://facebook.com/jeancro'
    },
    appearance: {
      primaryColor: '#4F46E5',
      accentColor: '#EC4899',
      darkMode: false
    },
    seo: {
      metaTitle: { EN: 'Jeancro Store', AR: 'متجر جينكرو' },
      metaDescription: { EN: 'Modern Store', AR: 'متجر عصري' },
      keywords: { EN: 'fashion', AR: 'أزياء' }
    },
    chatbot: {
      enabled: true,
      welcomeMessage: { EN: 'Welcome!', AR: 'مرحباً!' },
      autoShowOnPage: false
    },
    shipping: {
      freeShippingThreshold: 500,
      shippingCost: 50,
      shippingMethods: ['Standard', 'Express']
    }
  };

  const context = {
    products,
    categories,
    storeSettings: storeSettings || defaultStoreSettings
  };

  // محاولة الحصول على رد من الوظائف المحلية أولاً
  const localResponse = processUserMessage(message, context, currentLanguage);
  
  // إذا حصلنا على رد من الوظائف المحلية وليس الرسالة الافتراضية
  if (localResponse && 
      !localResponse.includes('لم أفهم طلبك') && 
      !localResponse.includes("didn't understand")) {
    return localResponse;
  }

  // البحث عن إجابة في الأسئلة الشائعة
  const userMessageLower = message.toLowerCase();
  const matchedFAQ = faqs.find(
    faq =>
      faq.question[currentLanguage]?.toLowerCase().includes(userMessageLower) ||
      userMessageLower.includes(
        faq.question[currentLanguage]
          ?.toLowerCase()
          .substring(0, Math.min(20, faq.question[currentLanguage].length)) || ''
      )
  );

  if (matchedFAQ) {
    return matchedFAQ.answer[currentLanguage] || matchedFAQ.answer.EN || 'No answer available';
  }

  // إذا لم نجد رد محلي، نستخدم Gemini AI
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemInstruction = `You are JeancroBot, a friendly and helpful AI assistant for Jeancro, an online clothing store.
Current language for responses: ${currentLanguage}.

Store Information:
- Store Name: ${(storeSettings || defaultStoreSettings).storeName}
- Currency: ${(storeSettings || defaultStoreSettings).currencySymbol}
- WhatsApp: ${(storeSettings || defaultStoreSettings).whatsappNumber}

Available Products (${products.length} total):
${products.slice(0, 5).map(product => 
  `- ${product.name[currentLanguage] || product.name.EN}: ${(storeSettings || defaultStoreSettings).currencySymbol}${product.price} (${product.inStock !== false ? 'Available' : 'Out of Stock'})`
).join('\n')}
${products.length > 5 ? `... and ${products.length - 5} more products` : ''}

Categories (${categories.length} total):
${categories.map(cat => `- ${cat.name[currentLanguage] || cat.name.EN}`).join('\n')}

Instructions:
1. Always respond in ${currentLanguage === 'AR' ? 'Arabic' : 'English'}
2. Be helpful and friendly
3. If asked about products, refer to the available list
4. For ordering, direct customers to WhatsApp
5. Keep responses concise but informative
6. Use emojis appropriately
7. If you don't know something, suggest contacting support`;

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: systemInstruction,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // في حالة فشل API، نعطي رد افتراضي مفيد
    return currentLanguage === LanguageCode.AR
      ? `🤖 أعتذر، أواجه مشكلة تقنية حالياً. يمكنك:\n\n` +
        `🛍️ كتابة "المنتجات" لرؤية منتجاتنا\n` +
        `📞 كتابة "تواصل" للحصول على معلومات التواصل\n` +
        `❓ كتابة "مساعدة" للحصول على المزيد من الخيارات\n\n` +
        `أو تواصل معنا مباشرة عبر واتساب: ${(storeSettings || defaultStoreSettings).whatsappNumber}`
      : `🤖 Sorry, I'm experiencing a technical issue right now. You can:\n\n` +
        `🛍️ Type "products" to see our products\n` +
        `📞 Type "contact" for contact information\n` +
        `❓ Type "help" for more options\n\n` +
        `Or contact us directly via WhatsApp: ${(storeSettings || defaultStoreSettings).whatsappNumber}`;
  }
};
