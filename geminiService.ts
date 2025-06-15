import { INITIAL_PRODUCTS, TRANSLATIONS } from '@/constants';
import type { FAQ, LanguageCode, Product, StoreSettings } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  generateProductDetailsMessage, 
  generateProductsListMessage, 
  isAskingAboutProducts, 
  parseProductRequest,
  isAskingAboutOrdering,
  isAskingAboutPayments,
  isAskingAboutShipping,
  isAskingAboutContact,
  generateOrderingInstructionsMessage,
  generatePaymentMethodsMessage,
  generateShippingInfoMessage,
  generateContactMessage
} from './utils/chatbotHelper';

// التأكد من توفر مفتاح API في متغيرات البيئة
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    'مفتاح Gemini API غير موجود. يرجى تعيين متغير البيئة VITE_GEMINI_API_KEY.'
  );
  // يمكن رمي خطأ أو التعامل مع هذه الحالة بشكل مناسب في التطبيق الحقيقي
  // في هذا المثال، سنتركه يتابع وسيفشل إذا تم استدعاء API بدون مفتاح
}

const genAI = new GoogleGenerativeAI(API_KEY || 'مفتاح_API_مفقود'); // توفير بديل للأمان
const modelName = 'gemini-1.5-flash';

// وظيفة للحصول على رد من شات بوت Gemini
export const getChatbotResponse = async (
  message: string, // رسالة المستخدم
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[], // تاريخ المحادثة
  faqs: FAQ[], // الأسئلة الشائعة
  currentLanguage: LanguageCode, // اللغة الحالية
  products: Product[] = INITIAL_PRODUCTS, // المنتجات المتاحة
  storeSettings?: StoreSettings // إعدادات المتجر
): Promise<string> => {
  if (!API_KEY) {
    return (
      TRANSLATIONS[currentLanguage].errorOccurred ||
      'API Key for Gemini is not configured.'
    );  }  // تحقق من طلب المستخدم
  const userMessageLower = message.toLowerCase();
  
  // تحقق ما إذا كان المستخدم يسأل عن كيفية تقديم الطلبات
  if (isAskingAboutOrdering(message)) {
    return generateOrderingInstructionsMessage(currentLanguage);
  }
  
  // تحقق ما إذا كان المستخدم يسأل عن طرق الدفع
  if (isAskingAboutPayments(message)) {
    return generatePaymentMethodsMessage(currentLanguage);
  }
    // تحقق ما إذا كان المستخدم يسأل عن الشحن والتوصيل
  if (isAskingAboutShipping(message)) {
    return generateShippingInfoMessage(currentLanguage);
  }
  
  // تحقق ما إذا كان المستخدم يطلب التواصل أو رقم WhatsApp
  if (isAskingAboutContact(message)) {
    return generateContactMessage(currentLanguage, storeSettings?.whatsappNumber);
  }
  
  // تحقق ما إذا كان المستخدم يسأل عن منتج محدد
  const productNumber = parseProductRequest(message);
  
  // عرض منتج محدد
  if (productNumber !== null && productNumber > 0 && productNumber <= products.length) {
    const product = products[productNumber - 1];
    // التأكد من وجود المنتج قبل إرسال التفاصيل
    if (product) {
      return generateProductDetailsMessage(product, currentLanguage, 'د.م');
    }
  }
  
  // تحقق ما إذا كان المستخدم يسأل عن المنتجات بشكل عام
  if (isAskingAboutProducts(message)) {
    return generateProductsListMessage(products, currentLanguage, 'د.م');
  }
  
  // البحث عن إجابة في الأسئلة الشائعة
  const matchedFAQ = faqs.find(
    faq =>
      faq.question[currentLanguage].toLowerCase().includes(userMessageLower) ||
      userMessageLower.includes(
        faq.question[currentLanguage]
          .toLowerCase()
          .substring(0, Math.min(20, faq.question[currentLanguage].length))
      ) // basic partial match
  );

  if (matchedFAQ) {
    return matchedFAQ.answer[currentLanguage];
  }  const systemInstruction = `You are JeancroBot, a friendly and helpful AI assistant for Jeancro, an online clothing store.
Current language for responses: ${currentLanguage}.

Available FAQs:
${faqs.map(faq => `- Q: ${faq.question[currentLanguage]}\n  A: ${faq.answer[currentLanguage]}`).join('\n')}

Available Products:
${products.map(product => 
  `- Name: ${product.name[currentLanguage]}\n  Price: ${product.price}\n  Category: ${product.categoryId}\n  Description: ${product.description[currentLanguage].substring(0, 100)}${product.description[currentLanguage].length > 100 ? '...' : ''}`
).join('\n\n')}

معلومات عن تقديم الطلبات ومعالجة المدفوعات:

## كيفية تقديم الطلبات:
1. تصفح المنتجات واختر ما تريده
2. أضف المنتجات إلى سلة التسوق
3. راجع طلبك في سلة التسوق
4. اضغط على زر "إرسال عبر WhatsApp"
5. سيتم توجيهك لتطبيق WhatsApp مع تفاصيل طلبك
6. أرسل الرسالة لفريق جينكرو
7. سنتواصل معك خلال دقائق لتأكيد الطلب
8. نتفق على تفاصيل التوصيل وطريقة الدفع
9. نحدد موعد التسليم المناسب لك

## مميزات الطلب عبر WhatsApp:
- لا حاجة لتسجيل الدخول أو إنشاء حساب
- تواصل مباشر وسريع مع فريق المبيعات
- تأكيد فوري للطلب
- مرونة كاملة في التوصيل والدفع
- إمكانية طرح الأسئلة مباشرة
- تخصيص الطلب حسب الحاجة

## طرق الدفع المتاحة:
- الدفع عند الاستلام (Cash on Delivery)
- البطاقات البنكية (Visa, Mastercard)
- التحويل البنكي
- PayPal
- الدفع الإلكتروني عبر البنوك المحلية

## معالجة المدفوعات:
- جميع المدفوعات آمنة ومشفرة
- الدفع عند الاستلام: ادفع للمندوب عند وصول الطلب
- الدفع الإلكتروني: يتم التحصيل فوراً بعد تأكيد الطلب
- في حالة الإلغاء: يتم إرجاع المبلغ خلال 3-7 أيام عمل
- أسعار الشحن: مجاني للطلبات أكثر من 500 درهم، وإلا 30 درهم

## أوقات المعالجة:
- معالجة الطلب: 24-48 ساعة
- الشحن داخل المدينة: 1-2 يوم عمل
- الشحن خارج المدينة: 3-5 أيام عمل
- الشحن الدولي: 7-14 يوم عمل

If the user's query is directly answered by an FAQ, provide that answer.
If the user asks about products, provide information about our available products.
If the user asks about a specific product, provide details about that product.
If the user asks about ordering or payments, provide detailed information from the above guidelines.
Otherwise, answer general questions about fashion, clothing, or common e-commerce queries.
Keep responses concise and helpful. If you don't know the answer, say so politely.
Do not provide medical, legal, or financial advice.
The store sells Men's, Women's, and Kids' clothing and accessories.
Today's date is ${new Date().toLocaleDateString()}.`;

  const contents = [
    ...chatHistory,
    { role: 'user' as const, parts: [{ text: message }] },
  ];

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
      systemInstruction: systemInstruction,
    });

    const response = await result.response;
    const text = response.text();
    return (
      text ||
      TRANSLATIONS[currentLanguage].errorOccurred ||
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return (
      TRANSLATIONS[currentLanguage].errorOccurred ||
      'An error occurred while contacting the AI. Please try again later.'
    );
  }
};

// Helper to parse JSON if Gemini is asked to return JSON.
// Not directly used by getChatbotResponse as it expects text, but useful if other Gemini calls need JSON.
export const parseGeminiJsonResponse = <T>(responseText: string): T | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim(); // Trim the extracted content itself
  }

  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error(
      'Failed to parse JSON response from Gemini:',
      e,
      'Raw text:',
      responseText
    );
    // In a real app, you might want to return a specific error object or message.
    // For now, returning null indicates failure.
    return null;
  }
};
