import { TRANSLATIONS } from '@/constants';
import type { FAQ, LanguageCode } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  currentLanguage: LanguageCode // اللغة الحالية
): Promise<string> => {
  if (!API_KEY) {
    return (
      TRANSLATIONS[currentLanguage].errorOccurred ||
      'API Key for Gemini is not configured.'
    );
  }

  // Simple FAQ check first
  const userMessageLower = message.toLowerCase();
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
  }

  const systemInstruction = `You are JeancroBot, a friendly and helpful AI assistant for Jeancro, an online clothing store.
Current language for responses: ${currentLanguage}.
Available FAQs:
${faqs.map(faq => `- Q: ${faq.question[currentLanguage]}\n  A: ${faq.answer[currentLanguage]}`).join('\n')}
If the user's query is directly answered by an FAQ, provide that answer.
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
