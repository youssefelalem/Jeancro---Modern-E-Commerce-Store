/**
 * Hook مخصص لإدارة وظائف Chatbot
 * يقدم واجهة مبسطة للتعامل مع Chatbot
 */

import { useAppContext } from './useAppContext';

export const useChatbot = () => {  const {
    products,
    isChatbotOpen,
    toggleChatbot: contextToggleChatbot,
    chatMessages,
    sendChatMessage: contextSendChatMessage,
    clearChatMessages: contextClearChatMessages,
    isChatLoading,
    faqs,
    currentLanguage,
    translations,
    storeSettings,
    addToCart,
  } = useAppContext();

  // فتح Chatbot
  const openChatbot = () => {
    if (!isChatbotOpen) {
      contextToggleChatbot();
    }
  };

  // إغلاق Chatbot
  const closeChatbot = () => {
    if (isChatbotOpen) {
      contextToggleChatbot();
    }
  };

  // تبديل حالة Chatbot
  const toggleChatbot = () => {
    contextToggleChatbot();
  };  // إرسال رسالة
  const sendMessage = async (message: string) => {
    if (message.trim()) {
      await contextSendChatMessage(message.trim());
    }
  };

  // بدء محادثة جديدة
  const startNewConversation = () => {
    contextClearChatMessages();
  };

  // إضافة منتج إلى السلة من الشات بوت
  const addProductToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      return true;
    }
    return false;
  };

  // الحصول على آخر رسالة
  const lastMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;

  // التحقق من وجود رسائل
  const hasMessages = chatMessages.length > 0;

  // عدد الرسائل
  const messageCount = chatMessages.length;

  // الحصول على الأسئلة الشائعة للغة الحالية
  const localizedFaqs = faqs.map(faq => ({
    id: faq.id,
    question: faq.question[currentLanguage] || faq.question.EN,
    answer: faq.answer[currentLanguage] || faq.answer.EN,
  }));  return {
    isChatbotOpen,
    chatMessages,
    isChatLoading,
    lastMessage,
    hasMessages,
    messageCount,
    localizedFaqs,
    openChatbot,
    closeChatbot,
    toggleChatbot,
    sendMessage,
    startNewConversation,
    addProductToCart,
    products,
    translations,
    currentLanguage,
    currencySymbol: storeSettings.currencySymbol
  };
};
