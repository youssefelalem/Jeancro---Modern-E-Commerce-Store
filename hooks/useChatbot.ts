/**
 * Hook مخصص لإدارة وظائف Chatbot
 * يقدم واجهة مبسطة للتعامل مع Chatbot
 */

import { useAppContext } from './useAppContext';

export const useChatbot = () => {
  const {
    isChatbotOpen,
    toggleChatbot: contextToggleChatbot,
    chatMessages,
    sendChatMessage: contextSendChatMessage,
    isChatLoading,
    faqs,
    currentLanguage,
    translations,
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
  };

  // إرسال رسالة
  const sendMessage = async (message: string) => {
    if (message.trim()) {
      await contextSendChatMessage(message.trim());
    }
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
  }));

  return {
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
    translations,
    currentLanguage,
  };
};
